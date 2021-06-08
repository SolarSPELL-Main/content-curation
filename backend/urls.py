from django.urls import include, path
from rest_framework import routers
from django.conf.urls.static import static

from .views import mock_data

urlpatterns = [
    path('metadata', mock_data),
]
