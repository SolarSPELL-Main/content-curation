from django.contrib import admin
from .models import MetadataType, Metadata, Content
# Register your models here.
admin.site.register(MetadataType)
admin.site.register(Metadata)
admin.site.register(Content)
