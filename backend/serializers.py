from rest_framework.serializers import ModelSerializer
from rest_framework.validators import UniqueTogetherValidator

from backend.models import Metadata, MetadataType, Content, Profile, \
    CopyrightPermission, Organization


class MetadataTypeSerializer(ModelSerializer):
    class Meta:
        model = MetadataType
        # fields = '__all__'
        fields = ("id", "name")


class MetadataSerializer(ModelSerializer):
    # type = MetadataTypeSerializer()
    class Meta:
        validators = [
            UniqueTogetherValidator(
                queryset=Metadata.objects.all(),
                fields=["name", "type"]
            )
        ]
        model = Metadata
        fields = ('id', 'name', 'type', 'metadataType')


class ContentSerializer(ModelSerializer):
    # created_by = StringRelatedField()
    class Meta:
        model = Content
        fields = (
            'id', 'file_name', 'title', 'content_file', 'description',
            'metadata_info', 'display_title',
            'metadata', 'active', 'copyright_notes',
            'additional_notes', 'published_date', 'created_by', 'created_on',
            'reviewed_by', 'reviewed_on', 'copyright_approved',
            'copyright_by', 'published_year', 'hash', 'original_source',
            'copyright_site', 'status', 'filesize', 'created_by_name',
            'copyright', 'reviewed_by_name',
        )


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = (
            'num_content',
        )


class CopyrightPermissionSerializer(ModelSerializer):
    class Meta:
        model = CopyrightPermission
        fields = (
            'organization', 'description', 'date_contacted', 'granted',
            'date_of_response', 'user', 'id', "organization_info", "user_name")


class OrganizationSerializer(ModelSerializer):
    class Meta:
        model = Organization
        fields = ('name', 'email', 'website', 'id')
