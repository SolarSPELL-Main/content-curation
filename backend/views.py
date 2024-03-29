from django.db.utils import IntegrityError
from django.db.models import Model
from django.shortcuts import render
from django.http.response import HttpResponse

from django.views.generic import TemplateView

from django_filters import rest_framework as filters
from django.core.paginator import QuerySetPaginator
from django.conf import settings

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, renderer_classes, action
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.permissions import DjangoModelPermissions

from allauth.socialaccount.models import SocialToken

import csv
import datetime
import zipfile
import io
import os
from os.path import basename
import tempfile

from backend.models import MetadataType, Metadata, Content, CopyrightPermission, \
    Organization
from backend.serializers import MetadataTypeSerializer, MetadataSerializer, \
    ContentSerializer, ProfileSerializer, CopyrightPermissionSerializer, \
    OrganizationSerializer
from backend.standardize_format import build_response

from .filters import ContentFilter, CopyrightPermissionFilter
import logging

logger = logging.getLogger(__name__)


class StandardDataView:
    page_size_query_param = "page_size"

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers
            )
        except IntegrityError:
            return build_response(
                status=status.HTTP_400_BAD_REQUEST,
                success=False,
                error="Already Exists in Database"
            )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return build_response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        sort_model = request.GET.getlist('sort_by')

        if sort_model != None:
            queryset = queryset.order_by(*sort_model)

        page = request.GET.get('page')

        if page != None:
            paginator = QuerySetPaginator(
                queryset,
                per_page=request.GET.get('page_size')
            )
            serializer = self.get_serializer(paginator.page(page), many=True)
            return build_response({
                'total': queryset.count(),
                'items': serializer.data,
            })

        serializer = self.get_serializer(queryset, many=True)
        return build_response({
            'total': queryset.count(),
            'items': serializer.data,
        })

class NeedsViewPermissions(DjangoModelPermissions):
    perms_map = dict(
        DjangoModelPermissions.perms_map,
        GET=["%(app_label)s.view_%(model_name)s"]
    )

class MetadataViewSet(StandardDataView, viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions, NeedsViewPermissions]
    queryset = Metadata.objects.all()
    serializer_class = MetadataSerializer


class MetadataTypeViewSet(StandardDataView, viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions, NeedsViewPermissions]
    queryset = MetadataType.objects.all()
    serializer_class = MetadataTypeSerializer

    @action(detail=True, methods=["GET"])
    def metadata(self, request, pk=None):
        queryset = Metadata.objects.filter(type_id=pk).order_by('name')
        page = request.GET.get('page')
        if page != None:
            paginator = QuerySetPaginator(
                queryset,
                per_page=request.GET.get('page_size')
            )
            serializer = MetadataSerializer(paginator.page(page), many=True)
            return build_response({
                'total': queryset.count(),
                'items': serializer.data,
            })
        return build_response({
            'total': queryset.count(),
            'items': MetadataSerializer(
                queryset, many=True
            ).data,
        })

    # Download MetadataType as CSV file
    @action(methods=['get'], detail=True)
    def downloadAsCSV(self, request, pk=None):
        response = HttpResponse(content_type='text/csv')
        filename = 'content-curation_metadatatype-{}.csv'.format(
            datetime.datetime.now()
                .strftime("%m-%d-%Y"))
        response['Content-Disposition'] = 'attachment; filename={}'. \
            format(filename)
        metadattype = self.get_queryset().order_by("name")

        writer = csv.DictWriter(response, ['name', 'metadata'])
        writer.writeheader()
        for mdt in metadattype:
            metadata = Metadata.objects.filter(type=mdt, type_id=pk)
            for mta in metadata:
                writer.writerow({'name': mdt.name, 'metadata': mta.name})
        return response


@api_view(('GET',))
@renderer_classes((JSONRenderer,))
def get_user(request, *args, **kwargs):
    if request.user.is_authenticated:
        token = ""
        try:
            token = SocialToken.objects.get(
                account__user=request.user, account__provider='google'
            ).token
        except SocialToken.DoesNotExist:
            pass

        serializer = ProfileSerializer(request.user.profile)

        return build_response({
            "token_key": token,
            "username": request.user.username,
            "email": request.user.email,
            "groups": [group.name for group in request.user.groups.all()],
            "user_id": request.user.id,
            "profile": serializer.data,
        })
    else:
        return build_response({
            "token_key": "",
            "username": "",
            "email": "",
            "groups": "",
            "user_id": "",
            "profile": None,
        })


class Welcome(TemplateView):
    template_name = 'welcome.html'


# Permission object that verifies that a user modifying content
# either owns that content or is a Library Specialist
class ContentOwnerPermissions(permissions.BasePermission):
    def has_object_permission(self, request, view, obj: Content):
        if request.method == "GET":
            return True
        else:
            return request.user == obj.created_by or \
                request.user.groups.filter(name="Library Specialist").exists()


class ContentViewSet(StandardDataView, viewsets.ModelViewSet):
    permission_classes = [NeedsViewPermissions, ContentOwnerPermissions]
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = ContentFilter

    def create(self, request, *args, **kwargs):
        request.data["created_by"] = request.user.id

        # If status is Review, then reviewed date should be none
        if "status" in request.data and request.data["status"] == "Review":
            request.data["reviewed_on"] = None

        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance:
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            file_path = os.path.join(settings.MEDIA_ROOT, instance.file_name)
            if os.path.exists(file_path):
                os.remove(file_path)
        return super().destroy(request, *args, **kwargs)

    def partial_update(self, request, pk=None):
        instance = self.get_object()
        if not instance:
            return Response(status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()

        # New file has been uploaded for content
        # Removes old one
        if "content_file" in data:
            file_path = os.path.join(settings.MEDIA_ROOT, instance.file_name)
            if os.path.exists(file_path):
                os.remove(file_path)

        # If status is Review, then reviewed date should be none
        if "status" in data and data["status"] == "Review":
            data["reviewed_on"] = None

        data["reviewed_by"] = request.user.id
        serializer = self.get_serializer(instance,
                                         data=data,
                                         many=isinstance(data, list),
                                         partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK,
                        headers=headers)


# Search Content Queryset
def search(request):
    content_list = Content.objects.all()
    content_filter = ContentFilter(request.GET, queryset=content_list)
    return render(request, 'content_list.html',
                  {'filter': content_filter})


@api_view(('GET',))
@renderer_classes((JSONRenderer,))
def check_duplicate(request):
    file_hash = request.GET.get("hash", None)
    if file_hash is not None:
        return build_response(Content.objects.filter(hash=file_hash).exists())
    else:
        return build_response(
            status=status.HTTP_400_BAD_REQUEST,
            error="Must Specify Hash"
        )


# Export content as CSV file
@api_view(('POST',))
@renderer_classes((JSONRenderer,))
def zipdownloadcsv(request):
  
        # Parse string "[a,b,c]" into array [a, b, c]
        logger.info("zipdownloadcsv ", request.POST.get("content"))
        content_ids = [
               int(s) for s in request.POST.get("content", None)[1:-1].split(",")
           ]
        
        #testing 
        #content_ids = [1,2,3,4,5,6]
        
         # Iterate through content objects, add CSV data to the CSV buffer and
        # the resepective files to the zip file
        content = Content.objects.filter(id__in=content_ids)
        #metadatatype as headername
        metadataType_set = set()
        content_dict={}
        for c in content:
            metadata_dict = {}
            temp_dict = {}
            for info in c.metadata_info():
                
                metadataType_set.add(str(info['type_name']))
                # dict of metadata based on types types 
                if str(info['type_name']) in metadata_dict:
                    if not isinstance(metadata_dict[str(info['type_name'])], list):
                        metadata_dict[str(info['type_name'])] = [metadata_dict[str(info['type_name'])]]
                    metadata_dict[str(info['type_name'])].append(str(info['name']))
                else:
                    metadata_dict[str(info['type_name'])] = str(info['name'])
            #format metadata with '|' symbol
            for k,v in metadata_dict.items():
                metadata_dict.update({k: str(v).replace("[","").replace(',',' |').replace(']','').replace("'","").strip()})
            temp_dict = {'file_name':c.file_name, 'title':c.title,'display_title':c.display_title ,'description':c.description,'active':c.status,
                'copyright_notes':c.copyright_notes, 'additional_notes' : c.additional_notes,
                'published_date':c.published_date, 'created_by':c.created_by, 'created_on':c.created_on, 'reviewed_by':c.reviewed_by,
                'reviewed_on':c.reviewed_on, 'copyright_by':c.copyright_by,
                'published_year':c.published_year(),'original_source': c.original_source,
                        'copyright_site': c.copyright_site,'status': c.status,'filesize': c.filesize}
            content_dict[c.id]= dict(list(temp_dict.items()) +list(metadata_dict.items()))
    
        # SpooledTemporaryFile represents a temp file in memory that only uses disk
        # if it runs out of ram, kind of like swap space
        with tempfile.SpooledTemporaryFile() as temp_zip:
            # path to look for content
            zip_subdir = settings.MEDIA_ROOT
            csvfilename = 'content-curation_webapp_Content-{}.csv'.format(
                datetime.datetime.now().strftime("%m-%d-%Y")
            )

            field_names = [
                 'file_name', 'title','display_title' ,'description', 'active',
                'copyright_notes', 'additional_notes',
                'published_date', 'created_by', 'created_on', 'reviewed_by',
                'reviewed_on', 'copyright_by',
                'published_year', 'original_source', 'copyright_site', 'status',
                'filesize']
            for type_head in metadataType_set:
                field_names.append(type_head)

            string_buffer = io.StringIO()
            writer = csv.DictWriter(string_buffer, fieldnames=field_names)
            writer.writeheader()
    
            with zipfile.ZipFile(
                    temp_zip, 'w', zipfile.ZIP_DEFLATED,compresslevel=9 ,allowZip64=True
            ) as zip_file:
                for con_key,con_data in content_dict.items():
                    temp_dict = con_data
                
                    writer.writerow(temp_dict)
                    #writer.writerows({field: str(con_data[str(key)]).get(field) or str(key) for field in field_names})
                    try:
                        for folder_name, subfolders, filenames in os.walk(
                                zip_subdir):
                            for filename in filenames:
                                if filename == str(temp_dict['file_name']):
                                    file_path = os.path.join(folder_name, filename)
                                    zip_file.write(file_path, basename(file_path))

                    except zipfile.BadZipfile:
                        error = "Bad Zip File"
                        logger.error(error)
                        return build_response(
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            error=error
                        )
                    except zipfile.LargeZipFile:
                        error = "Large Zip File"
                        logger.error(error)
                        return build_response(
                            status=status.HTTP_400_BAD_REQUEST,
                            error=error
                        )
                    except zipfile.OverflowError:
                        error ="Exceeds 2.1GB"
                        logger.error(error)
                        return build_response(
                            status=status.HTTP_400_BAD_REQUEST,
                            error=error
                        )
                # Write the csv buffer to the zip file
                zip_file.writestr(csvfilename, string_buffer.getvalue())
            # Needed to keep the file open
            temp_zip.seek(0)
            response = HttpResponse(temp_zip.read())
            response['content_type'] = "application/x-zip-compressed"
            response['Content-Length'] = temp_zip.tell()
            return response
            return build_response(
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error="Could not create temp file"
        )

# Export content as CSV file
@api_view(('POST',))
@renderer_classes((JSONRenderer,))
def zipdownloadcsv_backup(request):
    # Parse string "[a,b,c]" into array [a, b, c]
    print("zipdownloadcsv ", request.POST.get("content"))
    content_ids = [
        int(s) for s in request.POST.get("content", None)[1:-1].split(",")
    ]

    # SpooledTemporaryFile represents a temp file in memory that only uses disk
    # if it runs out of ram, kind of like swap space
    with tempfile.SpooledTemporaryFile() as temp_zip:
        # path to look for content
        zip_subdir = settings.MEDIA_ROOT
        csvfilename = 'content-curation_webapp_Content-{}.csv'.format(
            datetime.datetime.now().strftime("%m-%d-%Y")
        )

        field_names = [
            'file_name', 'title', 'description', 'metadata_info', 'active',
            'copyright_notes', 'additional_notes',
            'published_date', 'created_by', 'created_on', 'reviewed_by',
            'reviewed_on', 'copyright_approved', 'copyright_by',
            'published_year', 'original_source', 'copyright_site', 'status',
            'filesize'
        ]

        string_buffer = io.StringIO()
        writer = csv.DictWriter(string_buffer, fieldnames=field_names)
        writer.writeheader()

        # Iterate through content objects, add CSV data to the CSV buffer and
        # the resepective files to the zip file
        content = Content.objects.filter(id__in=content_ids)

        with zipfile.ZipFile(
                temp_zip, 'w', zipfile.ZIP_DEFLATED, allowZip64=True
        ) as zip_file:
            for con in content:
                writer.writerow({
                    'file_name': con.file_name,
                    'title': con.title,
                    'description': con.description,
                    'metadata_info': " | ".join(
                        str(obj["name"]) for obj in con.metadata_info()),
                    'active': con.active,
                    'copyright_notes': con.copyright_notes,
                    'additional_notes': con.additional_notes,
                    'published_date': con.published_date,
                    'created_by': con.created_by,
                    'created_on': con.created_on,
                    'reviewed_by': con.reviewed_by,
                    'reviewed_on': con.reviewed_on,
                    'copyright_approved': con.copyright_approved,
                    'copyright_by': con.copyright_by,
                    'published_year': con.published_year(),
                    'original_source': con.original_source,
                    'copyright_site': con.copyright_site,
                    'status': con.status,
                    'filesize': con.filesize
                })

                try:
                    for folder_name, subfolders, filenames in os.walk(
                            zip_subdir):
                        for filename in filenames:
                            if filename == con.file_name:
                                file_path = os.path.join(folder_name, filename)
                                zip_file.write(file_path, basename(file_path))

                except zipfile.BadZipfile:
                    error = "Bad Zip File"
                    logger.error(error)
                    return build_response(
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        error=error
                    )
                except zipfile.LargeZipFile:
                    error = "Large Zip File"
                    logger.error(error)
                    return build_response(
                        status=status.HTTP_400_BAD_REQUEST,
                        error=error
                    )
            # Write the csv buffer to the zip file
            zip_file.writestr(csvfilename, string_buffer.getvalue())
        # Needed to keep the file open
        temp_zip.seek(0)
        return HttpResponse(
            temp_zip.read(),
            content_type="application/x-zip-compressed"
        )
    return build_response(
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        error="Could not create temp file"
    )


# bulk edit metdata in content
@api_view(('POST', 'GET'))
@renderer_classes((JSONRenderer,))
def bulk_edit_content(request):
    content_ids = request.data.get("to_edit")
    old_metadata_id = request.data.get("to_remove")
    new_metadata_ids = request.data.get("to_add")

    try:
        for con_id in content_ids:
            if (len(old_metadata_id)) > 0:
                for meta_id in old_metadata_id:
                    for con in Content.objects.filter(
                            id=con_id, metadata__id=meta_id
                    ):
                        # Remove old metadata id
                        con.metadata.remove(meta_id)
                        # Add new metadata id
                        con.metadata.add(*new_metadata_ids)

            else:
                for con in Content.objects.filter(id=con_id):
                    con.metadata.add(*new_metadata_ids)

    except Exception as e:
        error = str(e)
        logger.error(error)
        return build_response(
            status=status.HTTP_400_BAD_REQUEST,
            error=error)

    return build_response(
        status=status.HTTP_200_OK
    )

# bulk edit content status
@api_view(('POST', 'GET'))
@renderer_classes((JSONRenderer,))
def bulk_edit_content_status(request):    
    content_ids = request.data.get("to_edit")
    status_id = request.data.get("content_status_id")

    try:
        for con_id in content_ids:
            if (len(status_id)) > 0:
                
                for con in Content.objects.filter(
                            id=con_id
                    ):
                    # Update content_status
                    con.status.update(status_id)

    except Exception as e:
        error = str(e)
        logger.error(error)
        return build_response(
            status=status.HTTP_400_BAD_REQUEST,
            error=error)

    return build_response(
        status=status.HTTP_200_OK
    )

class CopyrightPermissionViewSet(StandardDataView, viewsets.ModelViewSet):
    permissions_classes = [DjangoModelPermissions, NeedsViewPermissions]
    queryset = CopyrightPermission.objects.all()
    serializer_class = CopyrightPermissionSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = CopyrightPermissionFilter


class OrganizationViewSet(StandardDataView, viewsets.ModelViewSet):
    permissions_classes = [DjangoModelPermissions, NeedsViewPermissions]
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
