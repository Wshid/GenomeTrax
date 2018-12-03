#!/usr/bin/env python
import os
import urllib

try:
    import urllib.request as urllib2
except ImportError:
    import urllib2
from bs4 import BeautifulSoup

import xml.etree.ElementTree as ET

try:
    from PIL import Image
except:
    import Image

from io import BytesIO

pathDB='./cbi_webpage/static/keggData'
keggURL='http://rest.kegg.jp'
keggURL2='http://www.kegg.jp'
number_of_cut_string = 5

def kegg_download(species):
	try: os.makedirs('/'.join([pathDB,species]))
	except: pass
	# gene_list
	OF=open('/'.join([pathDB,species,'list.'+species]),'w')
	genes=urllib2.urlopen('/'.join([keggURL,'list',species])).read().decode('utf8')
	OF.write(genes)
	OF.close()
	# pathway_list
	OF=open('/'.join([pathDB,species,'list.pathway.'+species]),'w')
	pathways=urllib2.urlopen('/'.join([keggURL,'list','pathway',species])).read().decode('utf8')
	OF.write(pathways)
	OF.close()
	# kgml
	OF=open('/'.join([pathDB,species,'genePathways.table']),'w')
	for line in pathways.split('\n'):
		if line=='': break
		pathway=line.split('\t')[0][number_of_cut_string:]
		# print (pathway,'start')
		lines=urllib2.urlopen('/'.join([keggURL,'get','path:'+pathway,'kgml'])).read().decode('utf8')
		# print (pathway,'complete open')
		OF2=open('/'.join([pathDB,species,'get.'+pathway+'.kgml']),'w')
		OF2.write(lines);OF2.close()
		root=ET.fromstring(lines)
		for entry in root.findall('entry'):
			id=entry.get('id')
			type=entry.get('type')
			if type == 'gene':
				for name in entry.get('name').split(' '):
					OF.write('\t'.join([name.lstrip(species+':'),pathway+'_'+id,pathway])+'\n')
		OF2.close()
	OF.close()

def kegg_pathway_name(species):
	dic_pathway_name={}
	file = '/'.join([pathDB,species,'list.pathway.'+species])
	if not os.path.isfile(file):
		kegg_download(species)
	IF=open(file,'r')
	for line in IF:
		s=line.rstrip('\n').split('\t')
		pid=s[0][5:]
		name=s[1].rsplit('-',1)[0].rstrip().replace(' ','_').replace('/','')
		dic_pathway_name[pid]=name
	return dic_pathway_name

def kegg_idconverter(species):
	dic_idconverter={}
	file='/'.join([pathDB,species,'list.'+species])
	if not os.path.isfile(file):
		kegg_download(species)
	IF=open(file,'r')
	for line in IF:
		if not '(RefSeq)' in line or 'no KO assigned' in line:
			continue
		s=line.rstrip('\n')
		keggId=s.split('\t',1)[0].lstrip(species+':')
		raw_ids_text=s.split('\t',1)[1].split('(RefSeq)')
		ids=raw_ids_text[1].replace(" ","").replace("uncharacterized","").split(';')[0].split(',')
		for id in ids:
			if id.strip() in dic_idconverter:
				dic_idconverter[id.strip()].append(keggId)
			else:
				dic_idconverter[id.strip()]=[keggId]
	return dic_idconverter

def kegg_load(species):
	dic_g2p={}
	dic_p2g={}
	file='/'.join([pathDB,species,'genePathways.table'])
	if not os.path.isfile(file):
		kegg_download(species)
	IF=open(file,'r')
	for line in IF:
		g,s,p=line.rstrip('\n').split('\t')
		if not g in dic_g2p:
			dic_g2p[g]=[]
		dic_g2p[g].append(p)
		if not p in dic_p2g:
			dic_p2g[p]=[]
		dic_p2g[p].append(g)
	return dic_g2p,dic_p2g

def mapping(pathway,gene_info):
	'''
	# get example
	query=urllib2.Request('http://www.kegg.jp/kegg-bin/show_pathway?osa01200/default%3dpink/osa:4328598%09,blue')
	# post example
	url='http://www.kegg.jp/kegg-bin/show_pathway'
	values={'map':'hsa00010',
		'reference':'pink',
		'multi_query':'7167+blue,red\nC00118+blue,pink'}
	data=urllib.urlencode(values)
	query=urllib2.Request(url,data.replace('%2B','+'))
	'''
	# print("gene_id >> " + gene_info[0][0])
	# print("background_color >> " + gene_info[0][1][0])
	# print("foreground_color >> " + gene_info[0][1][1])
	url='http://www.kegg.jp/kegg-bin/show_pathway'
	gene_info_string=''
	if len(gene_info)==0:
		values={'map':pathway,
			'multi_query':'fake+red\n'}
	else:
		for index in range(len(gene_info)):
			gene_info_string += gene_info[index][0]+'+'+gene_info[index][1][0]+','+gene_info[index][1][1]+'/'

		values={'map':pathway, 'multi_query':gene_info_string}

	data=urllib.parse.urlencode(values)
	replaced_data=data.replace('%2B','+')
	full_url = url + "?" + replaced_data

	query=urllib2.Request(url,replaced_data.encode())
	print("<< Start to send query >> ")
	page = BeautifulSoup(urllib2.urlopen(query), "html.parser")
	print("<< End to send query >>")

	for div in page.find_all('img'):
		src=div['src']
		if src.startswith('/tmp/'):
			src=keggURL2+src
			return [len(gene_info),page.find('b').contents[0],full_url,src]
			# return urllib.request.urlopen(src).read()

def merge_image(lst_image,width,height):
	im=Image.open(BytesIO(lst_image[0]))
	w,h=im.size
	background=Image.new(im.mode,(w*width,h*height))
	background.paste(im,(0,0))
	for i in range(1,len(lst_image)):
		im=Image.open(BytesIO(lst_image[i]))
		x,y=i%width,i/width
		offset=x*w,y*h
		background.paste(im,offset)
	return background

'''
lst_image=[]
a=mapping('hsa00010',[['7167','#FFFF00']])
for i in range(6):
	lst_image.append(a)
im=merge_image(lst_image,3,2)
im.save('my.png')
'''
