# ngs_feature_hg버전_chr번호_position
import pymysql

conn=pymysql.connect(host='localhost', user='root', password='1', db='genometrax_schema', charset='utf-8') #connect
curs=conn.cursor() ## make a cursor
input_list_file = "각 chromosome 당 최대 길이를 가지고 있는 파일"
hg_version='hg18'
