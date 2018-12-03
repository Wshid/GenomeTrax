# ngs_feature_hg버전_chr번호_position
# 탭으로 구분된 파일을 읽어들여, 테이블을 생성하도록 한다.
import pymysql
import csv

conn=pymysql.connect(host='localhost', user='root', password='1', db='genometrax_schema', charset='utf-8') #connect
curs=conn.cursor() ## make a cursor
input_file_name = "각 chromosome 당 최대 길이를 가지고 있는 파일"
hg_version='hg18'
# 만들어야 할 테이블의 수가 많으므로, 개별 실행하도록 한다.

chr1, chr2 마다 다른 길이를 가지고 있기 때문에 이도 지정을 해주어야 한다

10000000 기준단위니까

반올림 하기로

chr1 - pos10000000, pos20000000 ...

CREATE TABLE genometrax_schema.ngs_feature_hg18_chr1_pos10000000 LIKE genometrax_schema.ngs_feature_hg18_chr1;
INSERT INTO genometrax_schema.ngs_feature_hg18_chr1_pos10000000 SELECT * FROM genometrax_schema.ngs_feature_hg18_chr1 WHERE feature_end < 10000000;

input_max_file=open(input_file_name, 'r')
list_max=csv.reader(input_max_file, delimiter='\t')
for row in list_max:
    chr_name=row[0]
    chromosome_position=round(int(row[1])+50000000) #반올림하여 최대치를 만들어냄
    for pos in chromosome_position/10000000:
        pos_name="pos"+str(pos)
        sql="CREATE TABLE genometrax_schema.ngs_feature_%s_%s_%s LIKE genometrax_schema.ngs_feature_%s_%s"
        curs.execute(sql,(hg_version, chr_name, pos_name, hg_version, chr_name))

        sql2="INSERT INTO genometrax_schema.ngs_feature_%s_%s_%s SELECT * FROM genometrax_schema.ngs_feature_%s_%s WHERE feature_end < %s"
        curs.execute(sql2,(hg_version, chr_name, pos_name, hg_version, chr_name, pos_name))
        conn.commit()

conn.close()
input_max_file.close()
