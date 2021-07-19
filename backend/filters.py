from django_filters import rest_framework as filters
from .models import Content, Metadata
from django import forms


# Search Content Filter criteria
class ContentFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    file_name = filters.CharFilter(lookup_expr='icontains')
    description = filters.CharFilter(lookup_expr='icontains')
    filesize = filters.NumberFilter()
    metadata = filters.ModelMultipleChoiceFilter(
        queryset=Metadata.objects.all(),
        widget=forms.CheckboxSelectMultiple)
    created_on = filters.DateFilter(widget=forms.SelectDateWidget)
    created_by = filters.CharFilter(lookup_expr='icontains')
    modified_on = filters.DateFilter(widget=forms.SelectDateWidget)
    modified_by = filters.CharFilter(lookup_expr='icontains')
    reviewed_on = filters.DateFilter(widget=forms.SelectDateWidget)
    reviewed_by = filters.CharFilter(lookup_expr='icontains')
    status = filters.MultipleChoiceFilter(choices=Content.STATUS,
                                          widget=forms.CheckboxSelectMultiple)
    published_date = filters.DateFilter(widget=forms.SelectDateWidget)
    active = filters.BooleanFilter(
        widget=filters.widgets.BooleanWidget())
    copyright_approved = filters.BooleanFilter(
        widget=filters.widgets.BooleanWidget())

    class Meta:
        model = Content
        fields = ['title', 'file_name', 'description', 'filesize',
                  'metadata', 'created_on', 'created_by', 'modified_on',
                  'modified_by',
                  'reviewed_on', 'reviewed_by', 'status', 'published_date',
                  'active', 'copyright_approved',
                  ]
