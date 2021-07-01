from django.db.utils import IntegrityError, Error
from django.shortcuts import render
from django.http.response import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, renderer_classes, action
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from backend.models import MetadataType, Metadata, Content
from backend.serializers import MetadataTypeSerializer, MetadataSerializer, \
    ContentSerializer
from backend.standardize_format import build_response

from django.middleware.csrf import get_token
from django.views.generic import TemplateView

from allauth.socialaccount.models import SocialToken
from django.contrib.auth.models import Group
from rest_framework.permissions import DjangoModelPermissions

class StandardDataView:
   # permission_classes = (IsAdminUser,)
    print("StandardDataView")
    def create(self, request, *args, **kwargs):
        print("create Standard View")
        try:
            serializer = self.get_serializer(data=request.data)
            print("request.data ",request.data)
            #print("serializer valid ",serializer.is_valid)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            print(headers)
            return Response(serializer.data, status=status.HTTP_201_CREATED, 
                            headers=headers)
        except IntegrityError as e:
            return build_response(status=status.HTTP_400_BAD_REQUEST, 
                            success=False, error="Already Exists in Database")


    def retrieve(self, request, *args, **kwargs):
        print("retreieve")
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return build_response(serializer.data)

    def list(self, request, *args, **kwargs):
        print("list")
        queryset = self.filter_queryset(self.get_queryset())
        #print("list ",queryset)
        page = self.paginate_queryset(queryset)
        if page != None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return build_response(serializer.data)



class MetadataViewSet(StandardDataView, viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = Metadata.objects.all()
    serializer_class = MetadataSerializer
    print("Metadataviewset  query ",queryset.query)

class MetadataTypeViewSet(StandardDataView, viewsets.ModelViewSet):
    permission_classes = [DjangoModelPermissions]
    queryset = MetadataType.objects.all()
    serializer_class = MetadataTypeSerializer

    @action(detail=True, methods=["GET"])
    def metadata(self, request, pk=None):
        return build_response(MetadataSerializer(
            Metadata.objects.filter(type_id=pk), many=True
        ).data)

@api_view(('GET',))
@renderer_classes((JSONRenderer,))
def get_user(request, *args, **kwargs):
    if request.user.is_authenticated:
        token = SocialToken.objects.get(
            account__user=request.user, account__provider='google'
        )
        return build_response({
            "token_key": token.token,
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
