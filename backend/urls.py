from django.urls import include, path
from rest_framework import routers
from django.conf.urls.static import static
from rest_framework import routers
from .views import mock_data,MetadataTypeViewSet,MetadataViewSet

router = routers.DefaultRouter()
router.register(r'metadata', MetadataViewSet,basename='metadata')
router.register(r'metadata_types', MetadataTypeViewSet,basename='metadata_types')

urlpatterns = [
    #path(r'metadata', mock_data),
    path('', include(router.urls)),
    #path(r'metadata',MetadataViewSet.as_view({'get':'get'}),name="metadata"),
    path(r'metadata',MetadataViewSet.as_view,name="metadata"),
]

