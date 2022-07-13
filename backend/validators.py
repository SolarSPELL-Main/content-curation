import os
import filecmp

from django.core.exceptions import ValidationError
from django.utils.text import get_valid_filename

from content_curation import settings

def validate_unique_filename(value):
    filepath = os.path.join(settings.CONTENTS_ROOT, 
                get_valid_filename(value.name))
    if os.path.isfile(filepath):
        raise ValidationError('Filename already exists.')

def validate_unique_file(value):
    ##Yet to find the use
    from utils import sha256
    files = [
        os.path.join(settings.CONTENTS_ROOT, filename) for filename
        in os.listdir(os.path.join(settings.CONTENTS_ROOT))
    ]
    for f in files:
        if os.path.getsize(f) == value.size:
            if sha256(open(f, "rb")) == sha256(value.file):
                raise ValidationError('File already exists with name ' + 
                                        os.path.basename(f))

def validate_file_size(value):
        filesize= value.size
        # 250 MB in bytes
        if filesize > 262144000:
            raise ValidationError("The maximum file size that can be uploaded is 250MB")
        else:
            return value