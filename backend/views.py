from django.db.utils import IntegrityError
from django.shortcuts import render
from django.http.response import JsonResponse
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, renderer_classes, action
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response

from backend.models import MetadataType, Metadata
from backend.serializers import MetadataTypeSerializer, MetadataSerializer
from backend.standardize_format import build_response

from django.middleware.csrf import get_token

@api_view(('GET',))
@renderer_classes((JSONRenderer,))
def mock_data(request):
    def build_metadata(name: str, id: int):
        return {
            "name": name,
            "id": id,
        }

    return JsonResponse({
        "Subject": [build_metadata(name, i) for i, name in enumerate(["Math", "Language Arts", "Computer Science"])],
        "Language": [build_metadata(name, i) for i, name in enumerate(["Arabic", "English", "Spanish", "Chinese", "Hindi"])],
    })



# Create your views here.

class StandardDataView:
   # permission_classes = (IsAdminUser,)
    print("StandardDataView")
    def create(self, request, *args, **kwargs):
        print("create Standard View")
        try:
            serializer = self.get_serializer(data=request.data)
            print("request.data ",request.data)
            #print("serializer valid ",serializer.is_valid)
            if(serializer.is_valid):
                print("valid serializer")
            else:
                print("invalid serializer")
            #print(" serializer" ,serializer)

            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            print(headers)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except IntegrityError as e:
            return build_response(status=status.HTTP_400_BAD_REQUEST, success=False, error="Already Exists in Database")


    def retrieve(self, request, *args, **kwargs):
        print("retreieve")
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return build_response(serializer.data)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        #print("list ",queryset)
        page = self.paginate_queryset(queryset)
        if page != None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return build_response(serializer.data)



class MetadataViewSet(StandardDataView, viewsets.ModelViewSet):
    queryset = Metadata.objects.all()
    serializer_class = MetadataSerializer
    print("Metadataviewset  query ",queryset.query)

    @action(methods=['get'], detail=True)
    def get(self, request, pk=None):
        print("Metadataviewset get function")
        queryset = self.filter_queryset(Metadata.objects.filter(type__name=pk))
        print("get in metadataset",queryset.query)
        page = self.paginate_queryset(queryset)
        if page != None:
            print("paginated_response")
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return build_response(serializer.data)


    def patch(self,request,pk):
        print("Metadataview patch service")
        metadata_model = self.get_object(pk)
        serializer = MetadataSerializer(metadata_model,data=request.data,partial=True)
        try:
            if(serializer.is_valid()):
                serializer.save()
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except IntegrityError as e:
            return build_response(status=status.HTTP_400_BAD_REQUEST, success=False, error="Already Exists in Database")


    def create(self, request, *args, **kwargs):
        print("Metadataviewset create function")
        serializer = MetadataSerializer(request.data)


class MetadataTypeViewSet(StandardDataView, viewsets.ModelViewSet):
    print("Metadatatypeset")
    queryset = MetadataType.objects.all()
    serializer_class = MetadataTypeSerializer
