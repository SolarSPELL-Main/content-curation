'''Importing from outside the project'''
from django.urls import include, path
from rest_framework import routers
from django.conf.urls.static import static
from rest_framework import routers

'''Importing from other files in the project'''
from .views import MetadataTypeViewSet, MetadataViewSet, \
    ContentViewSet, get_user, search
from content_curation import settings

router = routers.DefaultRouter()
router.register(r'metadata', MetadataViewSet,basename='metadata')
router.register(r'metadata_types', MetadataTypeViewSet,
                basename='metadata_types')
router.register(r'content', ContentViewSet, basename='content')

urlpatterns = [
    path(r'get_user/', get_user),
    path(r'search',search),
    path('', include(router.urls)),
]
