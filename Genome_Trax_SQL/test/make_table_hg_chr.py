## 테이블 제작 : ngs_feature_hg버전_chr번호
import pymysql

conn=pymysql.connect(host='localhost', user='root', password='1', db='genometrax_schema', charset='utf-8') #connect
curs=conn.cursor() ## make a cursor

hg_versions=['hg18', 'hg19', 'hg38']

for hg_version in hg_versions:
    for chr_num in range(1,23) ## 1~22까지 반복, 유전자는 chr1 ~ chr22와 chrX, chrY, chrM으로 이루어짐
        chr_string="chr"+str(chr_num) ## 문자열 변환함수, str()
        sql="CREATE TABLE genometrax_schema.ngs_feature_%s_%s LIKE genometrax_schema.ngs_feature_%s"
        curs.execute(sql, (hg_version, chr_string, hg_version))

        sql2="INSERT INTO genometrax_schema.ngs_feature_%s_%s SELECT * FROM genometrax_schema.ngs_feature_%s WHERE chromosome = '%s'"
        curs.execute(sql2, (hg_version, chr_str, hg_version))
        conn.commit()

    for chr_num in ['X','Y','Z'] ## 위와 내용은 동일함
        chr_string="chr"+str(chr_num) ## 문자열 변환함수, str()
        sql="CREATE TABLE genometrax_schema.ngs_feature_%s_%s LIKE genometrax_schema.ngs_feature_%s"
        curs.execute(sql, (hg_version, chr_string, hg_version))

        sql2="INSERT INTO genometrax_schema.ngs_feature_%s_%s SELECT * FROM genometrax_schema.ngs_feature_%s WHERE chromosome = '%s'"
        curs.execute(sql2, (hg_version, chr_str, hg_version))
        conn.commit()

conn.close()
