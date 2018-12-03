# -*- coding: utf-8 -*-
# Generated by Django 1.9.6 on 2016-06-02 02:51
from __future__ import unicode_literals

import ckeditor_uploader.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Clinvar',
            fields=[
                ('id', models.TextField(primary_key=True, serialize=False)),
                ('chr', models.TextField(blank=True, db_column='CHR', null=True)),
                ('pos', models.TextField(blank=True, db_column='POS', null=True)),
                ('snp', models.TextField(blank=True, db_column='SNP', null=True)),
                ('ref', models.TextField(blank=True, db_column='REF', null=True)),
                ('alt', models.TextField(blank=True, db_column='ALT', null=True)),
                ('qual', models.TextField(blank=True, db_column='QUAL', null=True)),
                ('filter', models.TextField(blank=True, db_column='FILTER', null=True)),
                ('clnsig', models.TextField(blank=True, db_column='CLNSIG', null=True)),
                ('clndsdb', models.TextField(blank=True, db_column='CLNDSDB', null=True)),
                ('clndsdbid', models.TextField(blank=True, db_column='CLNDSDBID', null=True)),
                ('clndbn', models.TextField(blank=True, db_column='CLNDBN', null=True)),
            ],
            options={
                'db_table': 'clinvar',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='HumanMethylation450',
            fields=[
                ('ilmnid', models.TextField(db_column='IlmnID', primary_key=True, serialize=False)),
                ('chr', models.TextField(blank=True, db_column='CHR', null=True)),
                ('mapinfo', models.TextField(blank=True, db_column='MAPINFO', null=True)),
                ('strand', models.TextField(blank=True, db_column='Strand', null=True)),
                ('ucsc_refgene_name', models.TextField(blank=True, db_column='UCSC_RefGene_Name', null=True)),
                ('ucsc_refgene_group', models.TextField(blank=True, db_column='UCSC_RefGene_Group', null=True)),
                ('ucsc_cpg_islands_name', models.TextField(blank=True, db_column='UCSC_CpG_Islands_Name', null=True)),
                ('relation_to_ucsc_cpg_island', models.TextField(blank=True, db_column='Relation_to_UCSC_CpG_Island', null=True)),
                ('dmr', models.TextField(blank=True, db_column='DMR', null=True)),
                ('enhancer', models.TextField(blank=True, db_column='Enhancer', null=True)),
            ],
            options={
                'db_table': 'human_methylation_450',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='NgsFeature',
            fields=[
                ('ngs_feature_no', models.IntegerField(primary_key=True, serialize=False)),
                ('chromosome', models.CharField(max_length=255)),
                ('feature_start', models.IntegerField()),
                ('feature_end', models.IntegerField()),
                ('strand', models.CharField(max_length=1)),
                ('genome', models.CharField(max_length=255)),
                ('score', models.CharField(max_length=255)),
                ('accession', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('ngs_ontology_no', models.IntegerField()),
            ],
            options={
                'db_table': 'ngs_feature',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='NgsOntology',
            fields=[
                ('ngs_ontology_no', models.IntegerField(primary_key=True, serialize=False)),
                ('short_name', models.CharField(max_length=255)),
                ('ucsc_track', models.CharField(max_length=255)),
                ('ucsc_color', models.CharField(max_length=12)),
                ('filename', models.CharField(max_length=255)),
                ('hyperlink', models.CharField(max_length=255)),
                ('ucsc_description', models.CharField(max_length=255)),
                ('feature_type', models.CharField(max_length=266)),
            ],
            options={
                'db_table': 'ngs_ontology',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='OutputFilteredGenesGtf',
            fields=[
                ('id', models.TextField(primary_key=True, serialize=False)),
                ('snp', models.TextField(blank=True, db_column='SNP', null=True)),
                ('chr', models.TextField(blank=True, db_column='CHR', null=True)),
                ('position', models.TextField(blank=True, db_column='POSITION', null=True)),
                ('type', models.TextField(blank=True, db_column='TYPE', null=True)),
                ('gene_id', models.TextField(blank=True, null=True)),
                ('gene_name', models.TextField(blank=True, null=True)),
                ('transcript_id', models.TextField(blank=True, null=True)),
                ('tss_id', models.TextField(blank=True, null=True)),
            ],
            options={
                'db_table': 'output_filtered_genes_gtf',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ArticleR',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('contents', ckeditor_uploader.fields.RichTextUploadingField()),
                ('thumbnail', models.ImageField(blank=True, upload_to='thumbnails/')),
                ('cdate', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='ArticleWeka',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('contents', ckeditor_uploader.fields.RichTextUploadingField()),
                ('thumbnail', models.ImageField(blank=True, upload_to='thumbnails/')),
                ('cdate', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='GuideManual',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('contents', ckeditor_uploader.fields.RichTextUploadingField()),
                ('thumbnail', models.ImageField(blank=True, upload_to='thumbnails/')),
                ('cdate', models.DateTimeField(auto_now_add=True)),
            ],
        ),
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
        migrations.CreateModel(
            name='Link',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('url', models.URLField(max_length=300)),
                ('thumbnail', models.ImageField(blank=True, upload_to='thumbnails/')),
                ('cdate', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]