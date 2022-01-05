from django.contrib import admin
from .models import MetadataType, Metadata, Content, \
    CopyrightPermission, Organization
# Register your models here.
admin.site.register(MetadataType)
admin.site.register(Metadata)
admin.site.register(Content)
admin.site.register(CopyrightPermission)
admin.site.register(Organization)
