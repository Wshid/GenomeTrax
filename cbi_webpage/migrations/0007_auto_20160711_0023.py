# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-07-11 00:23
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cbi_webpage', '0006_auto_20160711_0017'),
    ]

    operations = [
        migrations.RenameField(
            model_name='inputcoordinatestext',
            old_name='checked_databases',
            new_name='checked_database_list',
        ),
        migrations.RenameField(
            model_name='inputgenestext',
            old_name='checked_databases',
            new_name='checked_database_list',
        ),
    ]
