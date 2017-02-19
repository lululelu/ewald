from django.conf.urls import url, include
from . import views 

urlpatterns = [
    url(r'^$', views.default, name='default'),
    url(r'^home/$', views.home, name='home'),
    url(r'^login/$', views.login, name='login'),
    url(r'^signup/$', views.signup, name='signup'),
]

