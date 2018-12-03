-- hg 버전에 따른 분기
CREATE TABLE genometrax_schema.ngs_feature_hg18 LIKE genometrax_schema.ngs_feature;
INSERT INTO genometrax_schema.ngs_feature_hg18 SELECT * FROM genometrax_schema WHERE genome='hg18';
CREATE TABLE genometrax_schema.ngs_feature_hg19 LIKE genometrax_schema.ngs_feature;
INSERT INTO genometrax_schema.ngs_feature_hg19 SELECT * FROM genometrax_schema WHERE genome='hg19';
CREATE TABLE genometrax_schema.ngs_feature_hg38 LIKE genometrax_schema.ngs_feature;
INSERT INTO genometrax_schema.ngs_feature_hg38 SELECT * FROM genometrax_schema WHERE genome='hg38';

-- 
