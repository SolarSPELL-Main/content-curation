from .models import Content, Metadata, CopyrightPermission, Organization
from .enums import STATUS, COPYRIGHT_APPROVED

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
    copyright_approved = filters.ChoiceFilter(
        choices=COPYRIGHT_APPROVED,
        method="filter_copyright_approved"
    )
    copyright = filters.ModelChoiceFilter(
        queryset=CopyrightPermission.objects.all(),
        method="filter_copyright_permission",
        )

    def filter_metadata(self, queryset, name, value):
        if not value:
            return queryset

        metadata_list = self.data.getlist('metadata')

        for m in metadata_list:
            queryset = queryset.filter(metadata__pk=m)

        return queryset

    def filter_copyright_approved(self, queryset, name, value):
        if not value:
            return queryset
        
        if self.data["copyright_status"] == "unapproved":
            return queryset.filter(copyright__granted=False)
        elif self.data["copyright_status"] == "approved":
            return queryset.filter(copyright__granted=True)

        return queryset

    def filter_copyright_permission(self, queryset, name, value):
        if not value:
            return queryset

        copyright_list = self.data.getlist('copyright')

        for m in copyright_list:
            queryset = queryset.filter(copyright__pk=m)

        return queryset

    class Meta:
        model = Content
        fields = [
            'title', 'file_name', 'description', 'filesize',
            'metadata', 'created_on', 'created_by', 'modified_on',
            'modified_by', 'reviewed_on', 'reviewed_by', 'status',
            'published_date', 'active', 'copyright_approved',
            'copyright',
        ]


class CopyrightPermissionFilter(filters.FilterSet):
    organization = filters.ModelMultipleChoiceFilter(
        queryset=Organization.objects.all(),
        method="filter_organization",
        widget=forms.CheckboxSelectMultiple)

    date_contacted = filters.DateFromToRangeFilter(
        widget=RangeWidget(attrs={'type': 'date'}))

    granted = filters.BooleanFilter(
        widget=BooleanWidget())

    date_of_response = filters.DateFromToRangeFilter(
        widget=RangeWidget(attrs={'type': 'date'}))

    description = filters.CharFilter(lookup_expr='icontains')

    user = filters.ModelChoiceFilter(
        queryset=get_user_model().objects.all()
    )

    def filter_organization(self, queryset, name, value):
        if not value:
            return queryset

        organization_list = self.data.getlist('organization')

        for m in organization_list:
            queryset = queryset.filter(organization__pk=m)

        return queryset

    class Meta:
        model = CopyrightPermission
        fields = [
            'organization', 'description', 'date_contacted', 'granted',
            'date_of_response', 'user'
        ]
