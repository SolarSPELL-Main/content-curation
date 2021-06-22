from rest_framework.serializers import ModelSerializer
from rest_framework.validators import UniqueTogetherValidator
from backend.models import Metadata, MetadataType


class MetadataTypeSerializer(ModelSerializer):
    class Meta:
        model = MetadataType
        #fields = '__all__'
        fields=("id","name")


class MetadataSerializer(ModelSerializer):
    #type = MetadataTypeSerializer()
    class Meta:
        validators = [
            UniqueTogetherValidator(
                queryset=Metadata.objects.all(),
                fields=["name","type"]
            )
        ]
        model = Metadata
        fields = ('id', 'name', 'type','type_info')
    
