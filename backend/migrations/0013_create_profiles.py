from django.conf import settings
from django.db import migrations, models
from django.db.migrations.operations.models import DeleteModel
import django.db.models.deletion

# Create profiles for Users without them
def create_profiles(apps, schema_editor):
    user = apps.get_model('auth', 'User')
    profile = apps.get_model('backend', 'Profile')

    for user in user.objects.filter(profile=None):
        profile.objects.create(user=user)

class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('backend', '0012_profile'),
    ]

    operations = [
        migrations.RunPython(create_profiles),
    ]
