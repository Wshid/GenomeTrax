# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-08-10 08:59
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cbi_webpage', '0016_auto_20160810_0857'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inputcoordinatestext',
            name='input_coordinates_text',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='inputgenestext',
            name='input_genes_text',
            field=models.TextField(blank=True),
        ),
    ]
