# -*- coding: utf-8 -*-
import pymysql

def make_max_file_sql(chromosome_range, hg_version):
    for chr_num in chromosome_range:
        chr_string="chr"+str(chr_num)
        ##sql="""SELECT MAX(feature_end) FROM genometrax_schema_2018_2.ngs_feature_%s_%s"""
        sql="SELECT MAX(feature_end) FROM genometrax_schema_2018_2.ngs_feature_%s_%s"%(hg_version, chr_string)
        ##curs.execute(sql, (hg_version, chr_string))
        curs.execute(sql)
        #print("%s\t%s"%(chr_string, hg_version))

        row=curs.fetchall()
        output_string="%s \t %d\n" % (chr_string, max(row[0]))
        print(output_string)
        output_max_file.write(output_string) ## 탭으로 구분함

if __name__=="__main__":
    conn=pymysql.connect(host='localhost', user='root', password='1', db='genometrax_schema_2018_2') #connect
    curs=conn.cursor() ## make a cursor

    hg_versions=['hg18', 'hg19', 'hg38']

    for hg_version in hg_versions:
        #output_max_file_name='...'
        output_max_file=open("../ref/list_max_"+str(hg_version), "w")

        make_max_file_sql(range(1,23), hg_version)
        make_max_file_sql(['X', 'Y', 'M'], hg_version)
        output_max_file.close()
    conn.close()

def make_max_file(chromosome_range): ## chromosome에 따른 최대 길이를 반환한다.
    for chr_num in chromosome_range:
        chr_string='chr'+chr_num
        sql="""SELECT feature_end FROM genometrax_schema_2018_2.ngs_feature_%s_%s"""
        curs.execute(sql, (hg_version, chr_string))

        rows=curs.fetchall() #잘못하면 문자열로 계산되어 max가 안먹힐 수 있음
        output_max_file.write("%s \t %d" % (chr_string, max(rows))) ## 탭으로 구분함
