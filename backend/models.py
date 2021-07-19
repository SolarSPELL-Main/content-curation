'''Importing from outside the project'''
import os
import datetime
from django.db import models
from django.dispatch import receiver
import logging
from hashlib import sha256
from django.utils.text import get_valid_filename

'''Importing from other files in the project'''
from backend.validators import validate_unique_filename, validate_unique_file
from content_curation import settings

logger = logging.getLogger(__name__)


class MetadataType(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Metadata(models.Model):
    # TODO: Make sure there are no metadata with the same type and the
    # same name when creating a new one
    name = models.CharField(max_length=500)
    type = models.ForeignKey(MetadataType, on_delete=models.CASCADE)

    def metadataType(self):
        return {
            "id": self.type.id,
            "name": self.type.name
        }

    def __str__(self):
        return f'[{self.type}]{self.name}'


class Content(models.Model):
    def set_file_name(self, file_name):
        path = "media/contents/" + file_name
        # get file size if this content was saved individually
        if (self.content_file):
            self.hash = sha256(self.content_file.read()).hexdigest()
            self.filesize = self.content_file.size
            self.file_name = get_valid_filename(file_name)
        return path

    content_file = models.FileField(
        "File",
        upload_to=set_file_name,
        max_length=500,
        validators=[
            validate_unique_filename
        ])
    filesize = models.FloatField(null=True, editable=True)
    file_name = models.CharField(max_length=500, null=True)
    title = models.CharField(max_length=300)
    description = models.TextField(null=True)
    hash = models.CharField(max_length=128, null=True)
    # modified_on = models.DateTimeField(default=datetime.now)
    metadata = models.ManyToManyField(Metadata, blank=True)
    copyright_notes = models.TextField(null=True)
    rights_statement = models.TextField(null=True)
    additional_notes = models.TextField(null=True)
    published_date = models.DateField(null=True)
    # reviewed_on = models.DateField(null=True)
    active = models.BooleanField(default=1)
    # duplicatable = models.BooleanField(default=0)
    # Cataloger/Curator from loggedIn
    created_by = models.TextField(null=True)
    created_on = models.DateField(default=datetime.date.today, null=True)
    # further modified by curators/metadataaides/library specialist(s)to edit the filename and metadata record
    modified_by = models.TextField(null=True)
    modified_on = models.DateField(default=datetime.date.today, null=True)
    # Sara Team -> Reviews it
    reviewed = models.BooleanField(default=0)
    reviewed_by = models.TextField(null=True)
    reviewed_on = models.DateField(default=datetime.date.today, null=True)
    # CopyRight Permission for curator's content
    copyright_approved = models.BooleanField(default=1)
    copyright_by = models.TextField(null=True)
    copyright_on = models.DateField(default=datetime.date.today, null=True)
    copyright_site = models.TextField(null=True)
    original_source = models.TextField(null=True)
    STATUS = (
        ('Active', 'Active'),
        ('Archive', 'Archive'),
        ('Deaccession', 'Deaccession'),
        ('Review', 'Review'),
    )
    status = models.CharField(
        max_length=32,
        choices=STATUS,
        default='Active',
    )

    def published_year(self):
        return None if self.published_date == None else str(
            self.published_date.year)

    def metadata_info(self):
        return [{
            "id": metadata.id,
            "name": metadata.name,
            "type_name": metadata.type.name,
            "type": metadata.type.id
        } for metadata in self.metadata.all()]
