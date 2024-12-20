# Generated by Django 5.0.6 on 2024-08-15 10:41

import django.db.models.deletion
import positions.fields
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notebook_management', '0003_notebook_favorite'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='notebook',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notebooks', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='notebooksubtopic',
            name='order',
            field=positions.fields.PositionField(default=-1),
        ),
        migrations.AlterField(
            model_name='notebooktopic',
            name='order',
            field=positions.fields.PositionField(default=-1),
        ),
    ]
