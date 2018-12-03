import pymysql

def make_query(hg_version, hgnc_list):

    previous='init'
    for hgnc in list_hgnc:

        #라인별로 읽어온 무언가가 있을테니까 그거의 앞글자를 가져오긴 해야함\
        if previous[0]!=hgnc[0]:
            sql_create="CREATE TABLE genometrax_schema_2018_2.ngs_feature_"+hg_version+"_"+hgnc[0]+"_genes LIKE genometrax_schema_2018_2.ngs_feature_"+hg_version+";"
            sql_insert="INSERT INTO genometrax_schema_2018_2.ngs_feature_"+hg_version+"_"+hgnc[0]+"_genes SELECT * FROM genometrax_schema_2018_2.ngs_feature_"+hg_version+" WHERE description LIKE '%hgnc|"+hgnc[0]+"%';"
            sql_file.write(sql_create)
            sql_file.write('\n')
            sql_file.write(sql_insert)
            sql_file.write('\n')

        sql_create="CREATE TABLE genometrax_schema_2018_2.ngs_feature_"+hg_version+"_"+hgnc+"_genes LIKE genometrax_schema_2018_2.ngs_feature_"+hg_version+"_"+hgnc[0]+"_genes;"
        sql_insert="INSERT INTO genometrax_schema_2018_2.ngs_feature_"+hg_version+"_"+hgnc+"_genes SELECT * FROM genometrax_schema_2018_2.ngs_feature_"+hg_version+"_"+hgnc[0]+"_genes WHERE description LIKE '%hgnc|"+hgnc+"%';"

        previous=hgnc
        sql_file.write(sql_create)
        sql_file.write('\n')
        sql_file.write(sql_insert)
        sql_file.write('\n')

if __name__=="__main__":
    conn=pymysql.connect(host='localhost', user='root', password='1', db='genometrax_schema_2018_2') #connect
    curs=conn.cursor() ## make a cursor

    hg_versions=['hg18', 'hg19', 'hg38']
    #hg_versions=['hg18', 'hg19']

    for hg_version in hg_versions:
        input_file_name = "../ref/list_gene_name_two_char_"+hg_version
        output_file_name = "10_make_query_gene_name_"+hg_version+".sql"

        list_file=open(input_file_name, 'r')
        sql_file=open(output_file_name, 'w')

        list_lines=list_file.readlines()
        list_hgnc=[]

        for name in list_lines:
            list_hgnc.append(name.strip())

        make_query(hg_version, list_hgnc)
        list_file.close()
        sql_file.close()

    conn.close()
