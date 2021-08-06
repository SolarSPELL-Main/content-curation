from django.urls import include, path
from django.conf.urls.static import static

from rest_framework import routers
from rest_framework import routers

from .views import MetadataTypeViewSet, MetadataViewSet, \
    ContentViewSet, get_user, search, check_duplicate, zipdownloadcsv

router = routers.DefaultRouter()
router.register(r'metadata', MetadataViewSet, basename='metadata')
router.register(r'metadata_types', MetadataTypeViewSet,
                basename='metadata_types')
router.register(r'content', ContentViewSet, basename='content')

urlpatterns = [
    path(r'get_user/', get_user),
    path(r'search', search),
    path("check_duplicate/", check_duplicate),
    path(r'export/', zipdownloadcsv),
    path('', include(router.urls)),
]
