# Generated by Django 3.0.4 on 2021-09-27 05:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0015_auto_20210921_1628'),
    ]

    operations = [
        migrations.AddField(
            model_name='content',
            name='copyright',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.CopyrightPermission'),
        ),
    ]
