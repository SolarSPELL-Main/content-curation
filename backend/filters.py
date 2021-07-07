import django_filters
from .models import Content, Metadata
from django import forms


# Search Content Filter criteria
class ContentFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr='icontains')
    created_by = django_filters.CharFilter(lookup_expr='icontains')
    file_name = django_filters.CharFilter(lookup_expr='icontains')
    metadata = django_filters.ModelMultipleChoiceFilter(
        queryset=Metadata.objects.all(),
        widget=forms.CheckboxSelectMultiple)

    class Meta:
        model = Content
        fields = ['title', 'created_by',  'file_name','metadata',
                 ]
