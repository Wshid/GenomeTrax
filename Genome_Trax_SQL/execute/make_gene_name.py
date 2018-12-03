import pymysql

def query_format(hg_version):

    chrs=[]
    for i in range(1,23):
        chrs.append(str(i))
    chrs+=['X','Y','M']

    print(chrs)
    chr_list=[]; # 결과 값을 담을 리스트
    two_list=[]; # 앞 두글자만 담을 리스트

    for chr in chrs:
        chr_str='chr'+chr
        sql='SELECT COUNT(*) FROM information_schema.tables WHERE table_name LIKE \"ngs_feature_'+hg_version+'_'+chr_str+'_pos%\"'
        print(sql)
        curs.execute(sql)
        rows=curs.fetchall()
        cnt=rows[0][0]

        for i in range(1,cnt+1):
            table_name='ngs_feature_'+hg_version+'_'+chr_str+'_pos'+str(i*10000000)
            sql='SELECT description FROM '+table_name

            print('=========')
            print('prev %s_%s_%s\tlist size : %d\t two list size : %d' % (hg_version, chr_str, i, len(chr_list), len(two_list)))
            print('=========')

            curs.execute(sql)
            rows=list(curs.fetchall())
            for row in rows:
                ret=row[0].split('hgnc|')[1].split(';')[0].strip()

                if ',' in ret:
                    rets=ret.split(',')
                    for r in rets:
                        if r not in chr_list:
                            chr_list.append(r.strip())
                            print(r)
                            #list_file.write(r.strip())
                            #list_file.write('\n')
                            if r[:2] not in two_list: # not in 일때 글자도 체크하는 것이 맞음
                                two_list.append(r[:2].strip())
                else:
                    if ':' in ret :
                        ret=ret[1].strip()
                    if ret not in chr_list:
                        chr_list.append(ret)
                        print(ret)
                        #list_file.write(ret)
                        #list_file.write('\n')
                        if ret[:2].strip() not in two_list: # not in 일때 글자도 체크하는 것이 맞음
                            two_list.append(ret[:2].strip())

    chr_list.sort()
    list_file=open('list_gene_name_'+hg_version, 'w') #파일 쓰는 작업
    for i in chr_list:
        list_file.write(i)
        list_file.write('\n')
    list_file.close()


    two_list.sort() # 두글자 분류된 파일 쓰는 작업
    list_file_two_char=open('list_gene_name_two_char_'+hg_version, 'w')
    for i in two_list:
        list_file_two_char.write(i)
        list_file_two_char.write('\n')
    list_file_two_char.close()





if __name__=="__main__":
    conn=pymysql.connect(host='localhost', user='root', password='1', db='genometrax_schema') #connect
    curs=conn.cursor() ## make a cursor
    hg_version='hg18'
    query_format(hg_version)
    query_format('hg19')
    query_format('hg38')
    conn.close()
