from rest_framework.serializers import ModelSerializer
from rest_framework.validators import UniqueTogetherValidator
from backend.models import Metadata, MetadataType


#serializer : Converts native to python and vice versa
class MetadataTypeSerializer(ModelSerializer):
    class Meta:
        model = MetadataType
        #fields = '__all__'
        fields=("id","name")

#helps with validation of fields
class MetadataSerializer(ModelSerializer):
    type = MetadataTypeSerializer()
    class Meta:
        validators = [
            UniqueTogetherValidator(
                queryset=Metadata.objects.all(),
                fields=["id", "name","type"]
            )
        ]
        model = Metadata
        fields = ('id', 'name', 'type')
    """class Meta:
        model=MetadataType
        fields=("id","name","type")"""

    #overrides in-built update operation
    def update(self,instance, validated_data):
        print("Serializer Update metadata")
        metadata_validated_data = validated_data.pop('name')
        metadata = instance.metadata

        #save metadata info
        instance.name=validated_data.get('name',instance.name)
        instance.save()

        #save metadatatype info
        metadata.type=metadata_validated_data.get('type',instance.type)
        metadata.save()

        return instance

