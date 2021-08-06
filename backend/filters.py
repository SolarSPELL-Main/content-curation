from .models import Content, Metadata
from .enums import STATUS

from django_filters import rest_framework as filters
from django_filters import widgets
from django_filters.widgets import RangeWidget
from django import forms
from django.http import QueryDict
from django_filters.widgets import BooleanWidget
from django.contrib.auth import get_user_model


# Search Content Filter criteria
class ContentFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    file_name = filters.CharFilter(lookup_expr='icontains')
    description = filters.CharFilter(lookup_expr='icontains')
    filesize = filters.RangeFilter()
    metadata = filters.ModelMultipleChoiceFilter(
        queryset=Metadata.objects.all(),
        method="filter_metadata",
        widget=forms.CheckboxSelectMultiple)
    created_on = filters.DateFromToRangeFilter(
        widget=RangeWidget(attrs={'type': 'date'}))
    created_by = filters.ModelChoiceFilter(
        queryset=get_user_model().objects.all()
    )
    modified_on = filters.DateFromToRangeFilter(
        widget=RangeWidget(attrs={'type': 'date'}))
    modified_by = filters.CharFilter(lookup_expr='icontains')
    reviewed_on = filters.DateFromToRangeFilter(
        widget=RangeWidget(attrs={'type': 'date'}))
    reviewed_by = filters.CharFilter(lookup_expr='icontains')
    status = filters.ChoiceFilter(choices=STATUS)
    published_date = filters.DateFromToRangeFilter(
        widget=RangeWidget(attrs={'type': 'date'}))
    active = filters.BooleanFilter(
        widget=BooleanWidget())
    copyright_approved = filters.BooleanFilter(
        widget=BooleanWidget())

    def filter_metadata(self, queryset, name, value):
        if not value:
            return queryset

        metadata_list = self.data.getlist('metadata')

        for m in metadata_list:
            queryset = queryset.filter(metadata__pk=m)

        return queryset

    class Meta:
        model = Content
        fields = [
            'title', 'file_name', 'description', 'filesize',
            'metadata', 'created_on', 'created_by', 'modified_on',
            'modified_by', 'reviewed_on', 'reviewed_by', 'status',
            'published_date', 'active', 'copyright_approved',
        ]
