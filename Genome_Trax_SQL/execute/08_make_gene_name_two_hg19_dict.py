import pymysql
import operator

def query_format(hg_version):

    chrs=[]
    for i in range(1,23):
        chrs.append(str(i))
    chrs+=['X','Y','M']

    print(chrs)
    two_list=[]; # 앞 두글자만 담을 리스트
    two_dict={};

    for chr in chrs:
    #for chr in ['1']:
        chr_str='chr'+chr
        #sql="USE genometrax_schema_2018_2"
        #curs.execute(sql);
        sql='SELECT COUNT(*) FROM information_schema.tables WHERE table_schema LIKE \"%2018_2\" AND table_name LIKE \"ngs_feature_'+hg_version+'_'+chr_str+'_pos%\"'
        print(sql)
        curs.execute(sql)
        rows=curs.fetchall()
        cnt=rows[0][0]
        print(cnt);
        for i in range(1,cnt+1):
        #for i in range(1,3):
            table_name='ngs_feature_'+hg_version+'_'+chr_str+'_pos'+str(i*10000000)
            sql='SELECT description FROM '+table_name

            print('=========')
            print('prev %s_%s_%s\t two dict size : %d' % (hg_version, chr_str, i, len(two_dict)))
            print('=========')

            curs.execute(sql)
            rows=list(curs.fetchall())
            for row in rows:
                ret=row[0].split('hgnc|')[1].split(';')[0].strip()

                if ',' in ret:
                    rets=ret.split(',')
                    for r in rets:
                        cur=r[:2].strip() # 현재 key(real gene name)
                        if((not cur.isalpha()) or (cur[0].lower==cur[0])): #문자열이 알파벳이 아니거나, 첫글자가 소문자일때 거른다.
                            continue;
                        else:
                            two_dict[cur]=True; #True는 그냥 임의의 값

                else:
                    if ':' in ret :
                        ret=ret[1].strip()
                    cur=ret[:2].strip() # 현재 key(real gene name)
                    if((not cur.isalpha()) or (cur[0].lower==cur[0])): #문자열이 알파벳이 아니거나, 첫글자가 소문자일때 거른다.
                        continue;
                    else:
                        two_dict[cur]=True; #True는 그냥 임의의 값

    two_dict_sorted=sorted(two_dict.items(), key=operator.itemgetter(0)) # dict 정렬
    list_file_two_char=open('../ref/list_gene_name_two_char_'+hg_version, 'w')

    for i in two_dict_sorted:
        cur=i[0] # 현재 key(real gene name)
        #print(type(cur)) 하단 부분은 상단 애초에 집어넣지 않는다.
        #if((not cur.isalpha()) or (cur[0].lower==cur[0])): #문자열이 알파벳이 아니거나, 첫글자가 소문자일때 거른다.
        #    continue;
        #else:
        list_file_two_char.write(cur)
        list_file_two_char.write('\n')

    list_file_two_char.close()



if __name__=="__main__":
    conn=pymysql.connect(host='localhost', user='root', password='1', db='genometrax_schema_2018_2') #connect
    curs=conn.cursor() ## make a cursor
    #hg_version='hg18'
    #query_format(hg_version)
    query_format('hg19')
    #query_format('hg38')
    conn.close()
