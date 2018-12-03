import pymysql

def make_query(hg_version, chr_range):
    for chr_idx in chr_range:
        chr_string="chr"+str(chr_idx)
        stand=10000000
        #print("CHAR_STRING : "+chr_string)
        #print(list_dict)
        pos_limit=round(int(list_dict[chr_string])+5000000,-7)
        for i in range(1, int(pos_limit/pow(10,7))+1):
            pos_stand=str(i*stand)
            pos_string="pos"+pos_stand
            write_sql="CREATE TABLE genometrax_schema_2018_2.ngs_feature_"+hg_version+"_"+chr_string+"_"+pos_string+" LIKE genometrax_schema_2018_2.ngs_feature_"+hg_version+"_"+chr_string+";"
            write_sql+="\n"
            write_sql+="INSERT INTO genometrax_schema_2018_2.ngs_feature_"+hg_version+"_"+chr_string+"_"+pos_string+" SELECT * FROM genometrax_schema_2018_2.ngs_feature_"+hg_version+"_"+chr_string+" WHERE "
            if i==1:
                write_sql+="feature_end < "+pos_stand
            else:
                write_sql+=str((i-1)*stand)+"< feature_end AND feature_end < "+pos_stand

            print(write_sql)
            sql_file.write(write_sql+";")
            sql_file.write("\n")


if __name__=="__main__":
    conn=pymysql.connect(host='localhost', user='root', password='1', db='genometrax_schema_2018_2') #connect
    curs=conn.cursor() ## make a cursor
    #hg_version='hg18'
    hg_version='hg19'
    #hg_version='hg38'
    input_file_name = "../ref/list_max_"+hg_version
    output_file_name = "07_make_query_position_"+hg_version+".sql"

    list_file=open(input_file_name, 'r')
    sql_file=open(output_file_name, 'w')
    list_lines=list_file.readlines()
    list_dict={}
    for line in list_lines:
        split_line=line.split("\t")
        list_dict[split_line[0].strip()]=split_line[1].strip()

    make_query(hg_version, range(1,23))
    make_query(hg_version,['X', 'Y', 'M'])
