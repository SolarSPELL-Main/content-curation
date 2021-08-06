from django.conf import settings
from django.db import migrations, models
from django.db.migrations.operations.models import DeleteModel
import django.db.models.deletion

# Set reviewed_on to None for objects in Review status
def update_reviewed_on(apps, schema_editor):
    contents = apps.get_model('backend', 'Content')
    contents.objects.filter(status='Review').update(reviewed_on=None)

class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0013_create_profiles'),
    ]

    operations = [
        migrations.RunPython(update_reviewed_on),
    ]
