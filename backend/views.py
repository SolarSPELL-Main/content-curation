'''Importing from outside the project'''
from django.db.utils import IntegrityError, Error
from django.shortcuts import render
from django.http.response import JsonResponse, HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, renderer_classes, action
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from django.middleware.csrf import get_token
from django.views.generic import TemplateView
from allauth.socialaccount.models import SocialToken
from django.contrib.auth.models import Group
from rest_framework.permissions import DjangoModelPermissions
from django_filters import rest_framework as filters

from django.core.paginator import QuerySetPaginator

'''Importing from other files in the project'''
from backend.models import MetadataType, Metadata, Content
from backend.serializers import MetadataTypeSerializer, MetadataSerializer, \
    ContentSerializer
from backend.standardize_format import build_response
from .filters import ContentFilter
import datetime
import csv
import datetime
import zipfile
import io



class StandardDataView:
    # permission_classes = (IsAdminUser,)
    print("StandardDataView")

    page_size_query_param = "page_size"

    def create(self, request, *args, **kwargs):
        print("create Standard View")
        try:
            serializer = self.get_serializer(data=request.data)
            print("request.data ", request.data)
            # print("serializer valid ",serializer.is_valid)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            print(headers)
            return Response(serializer.data, status=status.HTTP_201_CREATED,
                            headers=headers)
        except IntegrityError as e:
            return build_response(status=status.HTTP_400_BAD_REQUEST,
                                  success=False,
                                  error="Already Exists in Database")

    def retrieve(self, request, *args, **kwargs):
        print("retreieve")
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return build_response(serializer.data)

    def list(self, request, *args, **kwargs):
        print("list")
        queryset = self.filter_queryset(self.get_queryset())
        # print("list ",queryset)
        # page = self.paginate_queryset(queryset)
        page = request.GET.get('page')
        if page != None:
            paginator = QuerySetPaginator(queryset,
                                          per_page=request.GET.get('page_size'))
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


class MetadataViewSet(StandardDataView, viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Metadata.objects.all()
    serializer_class = MetadataSerializer
    print("Metadataviewset  query ", queryset.query)


class MetadataTypeViewSet(StandardDataView, viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = MetadataType.objects.all()
    serializer_class = MetadataTypeSerializer

    @action(detail=True, methods=["GET"])
    def metadata(self, request, pk=None):
        return build_response(MetadataSerializer(
            Metadata.objects.filter(type_id=pk), many=True
        ).data)

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

        return build_response({
            "token_key": token,
            "username": request.user.username,
            "email": request.user.email,
            "groups": [group.name for group in request.user.groups.all()],
        })
    else:
        return build_response({
            "token_key": "",
            "username": "",
            "email": "",
            "groups": "",
        })


class Welcome(TemplateView):
    template_name = 'welcome.html'


class ContentViewSet(StandardDataView, viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = ContentFilter

    @api_view(['PATCH'])
    def patch(self, request, pk=None):
        print("Content View Set Patch")
        instance = self.get_object(pk)
        if not instance:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(instance,
                                         data=request.data,
                                         many=isinstance(request.data, list),
                                         partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        print(headers)
        return Response(serializer.data, status=status.HTTP_200_OK,
                        headers=headers)

    # Export content as CSV file
    @action(methods=['get'], detail=True)
    def zipdownloadcsv(self, request, pk=None):
        print("zipdownloadcssv")
        filename = 'content-curation_webapp_Content-{}.zip'.format(
            datetime.datetime.now().strftime("%m-%d-%Y"))
        csvfilename = 'content-curation_webapp_Content-{}.csv'.format(
            datetime.datetime.now().strftime("%m-%d-%Y"))
        response = HttpResponse(content_type='application/zip')
        response['Content-Disposition'] = 'attachment; filename={}'. \
            format(filename)
        metadataname = ""
        field_names = ['file_name', 'title', 'description', 'metadata_info',
                       'active', 'copyright_notes',
                       'rights_statement',
                       'additional_notes', 'published_date', 'created_by',
                       'created_on',
                       'reviewed_by', 'reviewed_on', 'reviewed',
                       'copyright_approved',
                       'copyright_by', 'published_year',
                       'original_source', 'copyright_site', 'status',
                       'filesize']

        string_buffer = io.StringIO()
        writer = csv.DictWriter(string_buffer,fieldnames=field_names)
        writer.writeheader()
        content = Content.objects.filter(id=pk)
        for con in content:
            for obj in con.metadata_info():
                metadataname += obj["name"] + "|" + metadataname
            print("metadata name ", metadataname)
            writer.writerow({'file_name': con.file_name,
                             'title': con.title,
                             'description': con.description,
                             'metadata_info': metadataname,
                             'active': con.active,
                             'copyright_notes': con.copyright_notes,
                             'rights_statement': con.rights_statement,
                             'additional_notes': con.additional_notes,
                             'published_date': con.published_date,
                             'created_by': con.created_by,
                             'created_on': con.created_on,
                             'reviewed_by': con.reviewed_by,
                             'reviewed_on': con.reviewed_on,
                             'reviewed': con.reviewed,
                             'copyright_approved': con.copyright_approved,
                             'copyright_by': con.copyright_by,
                             'published_year': con.published_year(),
                             'original_source': con.original_source,
                             'copyright_site': con.copyright_site,
                             'status': con.status,
                             'filesize': con.filesize
                             })

        with zipfile.ZipFile(response, 'w', zipfile.ZIP_DEFLATED) as zip_file:
            zip_file.writestr(csvfilename,string_buffer.getvalue())

        return response


# Search Content Queryset
def search(request):
    print("Search Content Filter")
    content_list = Content.objects.all()
    content_filter = ContentFilter(request.GET, queryset=content_list)
    return render(request, 'content_list.html',
                  {'filter': content_filter})


@api_view(('GET',))
@renderer_classes((JSONRenderer,))
def check_duplicate(request):
    hash = request.GET.get("hash", None)
    if hash is not None:
        return build_response(Content.objects.filter(hash=hash).exists())
    else:
        return build_response(
            status=status.HTTP_400_BAD_REQUEST,
            error="Must Specify Hash"
        )
