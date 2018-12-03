# 쓰레드 작업 관련하여 작성하기
# 아무래도 리스트에 전체 항목에 대한 개수를 담은 뒤 조합한 후
# 5~8개씩 동시 작업 시키는 쓰레드 만들면 될 듯 함

import pymysql
import threading
import time

class sqlThread(threading.Thread):

    def init(self, hg_version, chr_num, pos_num):
        threading.Thread.__init(self)
        self.hg_version=hg_version
        self.chr_str='chr'+str(chr_num)
        self.pos_str='pos'+str(pos_num*10e6)

    def run(self):
        conn=pymysql.connect(host='localhost', user='root', password='1', db='genometrax_schema') #connect
        curs=conn.cursor()
        if(

        self.table_name='ngs_feature_'+self.hg_version+'_'+self.chr_str+'_pos'+str(i*10000000)
        self.sql='SEARCH description FROM '+self.table_name
        
        print('=========')
        print('prev %s_%s_%s\t two list size : %d' % (self.hg_version, self.chr_str, self.pos_str, len(two_list))) ## two list 
        print('=========')

        curs.execute()
        
def query_format(hg_version):

    chrs=[]
    for i in range(1,23):
        chrs.append(str(i))
    chrs+=['X','Y','M']

    print(chrs)
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
            print('prev %s_%s_%s\t two list size : %d' % (hg_version, chr_str, i, len(two_list)))
            print('=========')

            curs.execute(sql)
            rows=list(curs.fetchall())
            for row in rows:
                ret=row[0].split('hgnc|')[1].split(';')[0].strip()

                if ',' in ret:
                    rets=ret.split(',')
                    for r in rets:
                        if r[:2] not in two_list: # not in 일때 글자도 체크하는 것이 맞음
                            two_list.append(r[:2].strip())
                            print(r[:2].strip())
                else:
                    if ':' in ret :
                        ret=ret[1].strip()
                    if ret[:2].strip() not in two_list: # not in 일때 글자도 체크하는 것이 맞음
                        two_list.append(ret[:2].strip())
                        print(ret[:2].strip())

    two_list.sort() # 두글자 분류된 파일 쓰는 작업
    list_file_two_char=open('list_gene_name_two_char_'+hg_version, 'w')
    for i in two_list:
        list_file_two_char.write(i)
        list_file_two_char.write('\n')
    list_file_two_char.close()





if __name__=="__main__":
    conn=pymysql.connect(host='localhost', user='root', password='1', db='genometrax_schema') #connect
    curs=conn.cursor() ## make a cursor
    #hg_version='hg18'
    #query_format(hg_version)
    query_format('hg18')
    #query_format('hg38')
    conn.close()
