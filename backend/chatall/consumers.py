from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
from .utils import get_json_to_send
from rest_framework.authtoken.models import Token


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = 'all'
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()


    def send_group_msg(self,func,data):
 
        data.update({"username":self.scope["user"].username,"first_name":self.scope["user"].first_name})
        response_dict=func(data)
        response_dict["type"]="chat.sendmessage"        
        
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            response_dict
        )

    def disconnect(self, close_code):
        # Leave room group
        data_to_send=get_json_to_send("user_disconnect")

        self.send_group_msg(data_to_send,{})

        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def manage_user_authentication(self,text_data):
        if self.scope['user'].id:
            pass
        else:
            try:
                data = json.loads(text_data)
                if 'token' in data.keys():
                    token_key = data['token']
                    token = Token.objects.get(key=token_key)
                    user = token.user
                    self.scope['user'] = user
                    
            except Exception as e:
                print(e)
                pass

        if not self.scope['user'].id:
            self.close()

    # Receive message from WebSocket
    def receive(self, text_data):

        self.manage_user_authentication(text_data)
        text_data_json = json.loads(text_data)
        msg_type = text_data_json['type']
        data_to_send=get_json_to_send(msg_type)
        self.send_group_msg(data_to_send,text_data_json)


    def chat_sendmessage(self, event):
        self.send(text_data=json.dumps(event))