from django.conf.urls import url, include
from . import views

urlpatterns = [
    url(r'^Register/$', views.Register.as_view(),name='register'),
    url(r'^Login/$', views.Login.as_view(),name='login'),
    url(r'ListMessage/$', views.MessageList.as_view(), name='message-list'),
]
