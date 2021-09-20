from django.urls import include, path
from django.conf.urls.static import static

from rest_framework import routers
from rest_framework import routers

from .views import MetadataTypeViewSet, MetadataViewSet, \
    ContentViewSet, get_user, search, check_duplicate, zipdownloadcsv,\
    bulk_edit_content,CopyrightViewSet,OrganizationViewSet

router = routers.DefaultRouter()
router.register(r'metadata', MetadataViewSet, basename='metadata')
router.register(r'metadata_types', MetadataTypeViewSet,
                basename='metadata_types')
router.register(r'content', ContentViewSet, basename='content')
router.register(r'copyright',CopyrightViewSet, basename ='copyright')
router.register(r'organization',OrganizationViewSet, basename='organization')

urlpatterns = [
    path(r'get_user/', get_user),
    path(r'search', search),
    path("check_duplicate/", check_duplicate),
    path(r'export/', zipdownloadcsv),
    path(r'bulk_edit_content/', bulk_edit_content),
    path('', include(router.urls)),
]
