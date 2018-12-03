import pymysql

conn=pymysql.connect(host='localhost', user='root', password='1', db='genometrax_schema', charset='utf-8') #connect
curs=conn.cursor() ## make a cursor
input_list_file = "/home/kwangsookim/Documents/cbi_project/cbi_proejct/Genome_Trax_SQL/gene_name_two_char"
hg_version='hg18'
output_list_file_name = "make_sql_table_by_gene_name"+hg_version

input_list = [x.strip() for x in open(input_list_file,"r").readlines()] ## 두글자 데이터를 읽어온다.
#gene_filtered_list_file_open = open(output_list_file_name,"w") ## 출력할 파일이긴 한데, 사용하지 않을 예정

first_string = "CREATE TABLE genometrax_schema.ngs_feature_"+hg_version
second_string="_genes LIKE genometrax_schema.ngs_feature_"+hg_version
third_string = "INSERT INTO genometrax_schema.ngs_feature_"+hg_version
forth_string="_genes SELECT * FROM genometrax_schema.ngs_feature_"+hg_version
fifth_string="_genes WHERE description LIKE '%hgnc|"

previous_input_list_element="init"

for input_list_element in input_list: # input_list(파일)에서 LBL로 가져옴
	# 문자가 바뀔때마다 베이스 테이블(A, B와 같이 한글자로 이루어진)을 생성하기 때문에 이를 구분함
	try:
		if input_list_element[0] != previous_input_list_element[0]: # 맨 앞글자가 동일하지 않다면(i)
		"""
			sql=first_string+"_"+input_list_element[0]+second_string
			curs.execute(sql)
			sql2=third_string+"_"+input_list_element[0]+forth_string+fifth_string[6:]+input_list_element[0]+"%'"
			curs.execute(sql2)
			conn.commit() ## DML 사용시 필요함(INSERT)
		"""
			sql3=first_string+"_%s"+second_string
			curs.execute(sql3,(input_list_element[0]));

			sql4=third_string+"_%s"+forth_string+"%s%s%'"
			curs.execute(sql4, (input_list_element[0], fifth_string[6:], input_list_element[0]))
			conn.commit()

		# 맨 앞글자가 동일하거나, 동일하지 않거나 두가지 케이스에 모두 진행되어야 하는 구문
		sql=first_string + "_"+input_list_element + second_string # 형태만 추출하는 것이기 때문에 상관 없음
		curs.execute(sql)
		sql2=third_string+"_"+input_list_element+forth_string+"_"+input_list_element[0]+fifth_string+input_list_element+"%'"
		curs.execute ## DML 사용시 필요함(INSERT)

		previous_input_list_element = input_list_element # 한바퀴 돌때마다 이전 내용을 저장함
	except:
		print("Occured ERROR on gene name SQL")
		exit(-1)

conn.close()
