from django.urls import path
from django.conf.urls import url
from . import consumers

websocket_urlpatterns = [
    url('ws/chat/all/$', consumers.ChatConsumer),
]
