from django_filters import rest_framework as filters
from .models import Content, Metadata
from django import forms


# Search Content Filter criteria
class ContentFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    created_by = filters.CharFilter(lookup_expr='icontains')
    file_name = filters.CharFilter(lookup_expr='icontains')
    metadata = filters.ModelMultipleChoiceFilter(
        queryset=Metadata.objects.all(),
        widget=forms.CheckboxSelectMultiple)

    class Meta:
        model = Content
        fields = [
            'title', 'created_by', 'file_name','metadata',
        ]
