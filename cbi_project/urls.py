from django.conf.urls import include, url
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin

from cbi_webpage.views import *

from rest_framework.urlpatterns import format_suffix_patterns
from django.views.static import serve

urlpatterns = [
    url(r'^$', index, name='index'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^blank/', blank, name='blank'), #테스트용 url
    url(r'^index/', index, name='index'), # url(url 주소, views 함수 이름, view 별칭)
    url(r'^show_igv/', show_igv, name='show_igv'),
    url(r'^show_igv_browser/(.*)', show_igv_browser, name='show_igv_browser'),
    url(r'^show_organization_chart/', show_organization_chart, name='show_organization_chart'),
    url(r'^show_people/', show_people, name='show_people'),
    url(r'^show_server_architecture/', show_server_architecture, name='show_server_architecture'),
    url(r'^show_genometrax/(\w+)/(\w+)', show_genometrax, name='show_genometrax'), # 각각 option과 filteron의미
    url(r'^show_genometrax_get/(.*)', show_genometrax_get, name='show_genometrax_get'), # gET할때 사ㅣ용
    #url(r'^show_genometrax_results/(\d+)/(\d+)/(\d+)/$', show_genometrax_results, name='show_genometrax_results'),
    url(r'^show_genometrax_results/(\d+)/(\d+)/(\d+)/(\w+)/$', show_genometrax_results, name='show_genometrax_results'),
    url(r'^show_kegg/', show_kegg, name='show_kegg'),
    url(r'^show_tcga/', show_tcga, name='show_tcga'),
    url(r'^show_analysis/', show_analysis, name='show_analysis'),
    url(r'^show_server_rent/', show_server_rent, name='show_server_rent'),
    url(r'^show_main_link/', show_main_link, name='show_main_link'), # 새로 추가하는 페이지
    url(r'^show_link/(\d+)/$', show_link, name='show_link'),
    url(r'^show_r_page/(\d+)/$', show_r_page, name='show_r_page'),
    url(r'^show_r_article/(?P<id>\d+)$', show_r_article, name='show_r_article'),
    url(r'^show_program_page/(\d+)/$', show_program_page, name='show_program_page'),
    url(r'^show_program/(?P<id>\d+)$', show_program, name='show_program'),
    url(r'^write_r_article/', write_r_article, name='write_r_article'),
    url(r'^delete_r_article/(\d+)/$',delete_r_article, name='delete_r_article'),
    url(r'^delete_all_r_article/',delete_all_r_article, name='delete_all_r_article'),
    url(r'^ckeditor/', include('ckeditor_uploader.urls')),
    url(r'^write_program/', write_program, name='write_program'),
    url(r'^write_link/', write_link, name='write_link'),
    url(r'^upload_text_file/', upload_text_file, name='upload_text_file'),
    url(r'^export_xlsx/(\w+)/(\d+)/(\d+)', export_xlsx, name='export_xlsx'),
    #url(r'^file_download/(.*)'), file_donload, name="file_download"),
    url(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = format_suffix_patterns(urlpatterns)
