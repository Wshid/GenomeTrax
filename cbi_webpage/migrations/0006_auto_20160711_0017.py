# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-07-11 00:17
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cbi_webpage', '0005_auto_20160706_0847'),
    ]

    operations = [
        migrations.CreateModel(
            name='InputCoordinatesText',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('input_coordinates_text', models.TextField(blank=True)),
                ('checked_databases', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='InputGenesText',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('input_genes_text', models.TextField(blank=True)),
                ('checked_databases', models.TextField(blank=True)),
            ],
        ),
        migrations.DeleteModel(
            name='InputText',
        ),
    ]
