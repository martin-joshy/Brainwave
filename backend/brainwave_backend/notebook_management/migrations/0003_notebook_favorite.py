# Generated by Django 5.0.6 on 2024-08-14 04:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notebook_management', '0002_notebooksubtopic_order_notebooktopic_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='notebook',
            name='favorite',
            field=models.BooleanField(default=False),
        ),
    ]
