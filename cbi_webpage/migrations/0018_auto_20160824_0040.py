# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-08-24 00:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cbi_webpage', '0017_auto_20160810_0859'),
    ]

    operations = [
        migrations.CreateModel(
            name='InputText',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('selected_input', models.CharField(max_length=30)),
                ('selected_db', models.CharField(max_length=30)),
                ('input_text', models.TextField(blank=True)),
                ('input_text_file', models.FileField(blank=True, upload_to='textfiles/')),
            ],
        ),
        migrations.RemoveField(
            model_name='inputcoordinatestext',
            name='search_option',
        ),
        migrations.RemoveField(
            model_name='inputgenestext',
            name='search_option',
        ),
    ]
