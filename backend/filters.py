from django_filters import rest_framework as filters
from django_filters import widgets
from django_filters.widgets import RangeWidget
from .models import Content, Metadata
from django import forms
from django_filters.widgets import BooleanWidget
from .enums import STATUS


# Search Content Filter criteria
class ContentFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    file_name = filters.CharFilter(lookup_expr='icontains')
    description = filters.CharFilter(lookup_expr='icontains')
    filesize = filters.RangeFilter()
    metadata = filters.ModelMultipleChoiceFilter(
        queryset=Metadata.objects.all(),
        widget=forms.CheckboxSelectMultiple)
    created_on = filters.DateFromToRangeFilter(
        widget=RangeWidget(attrs={'type': 'date'}))
    created_by = filters.CharFilter(lookup_expr='icontains')
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

    class Meta:
        model = Content
        fields = [
            'title', 'file_name', 'description', 'filesize',
            'metadata', 'created_on', 'created_by', 'modified_on',
            'modified_by', 'reviewed_on', 'reviewed_by', 'status',
            'published_date', 'active', 'copyright_approved',
        ]
