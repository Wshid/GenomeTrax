-- hg 버전에 따른 분기
CREATE TABLE genometrax_schema_2018_2.ngs_feature_hg19 LIKE genometrax_schema_2018_2.ngs_feature;
INSERT INTO genometrax_schema_2018_2.ngs_feature_hg19 SELECT * FROM genometrax_schema_2018_2.ngs_feature WHERE genome='hg19';
CREATE TABLE genometrax_schema_2018_2.ngs_feature_hg38 LIKE genometrax_schema_2018_2.ngs_feature;
INSERT INTO genometrax_schema_2018_2.ngs_feature_hg38 SELECT * FROM genometrax_schema_2018_2.ngs_feature WHERE genome='hg38';

--
