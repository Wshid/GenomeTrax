# -*- coding: utf-8 -*-

import pymysql

conn=pymysql.connect(host='localhost', user='root', password='1', db='genometrax_schema') #connect utf-8 제거
##curs=conn.cursor(buffered=True) ## make a cursor
curs=conn.cursor() ## make a cursor

hg_versions=['hg18'] ## hg_versions

for hg_version in hg_versions:
    ret=[]
    sql='SELECT description FROM ngs_feature_'+hg_version
    curs.execute(sql)
    rows=list(curs.fetchall())
    print(type(rows))
    for row in rows:
        #print("ROW : "+row[0])
        two_char=row[0].split('hgnc|')[1][:2]
        print("read : %s"%two_char)
        if two_char in ret: ## only two character in hgnc at description
            pass
        else:
            ret.append(two_char) ## not duplicated

    ret.sort() ## ascending
    f=open('ref/gene_name_two_char_'+hg_version, 'w') ## gene_name_two_char_hg18 ...
    for r in ret: 
        f.write(r)
        f.write('\n')
    f.close()

conn.close()
