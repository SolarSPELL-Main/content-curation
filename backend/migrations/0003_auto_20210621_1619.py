# Generated by Django 3.0.4 on 2021-06-21 23:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_auto_20210615_1701'),
    ]

    operations = [
        migrations.AlterField(
            model_name='metadata',
            name='name',
            field=models.CharField(max_length=500, unique=True),
        ),
    ]
