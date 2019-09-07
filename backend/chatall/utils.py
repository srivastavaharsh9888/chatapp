from api.models import Message
from aylienapiclient import textapi
from django.contrib.auth.models import User
import json

client = textapi.Client("daf9ffb7", "0fb289b2fc09676a9d5082ec0625f7d5")
    
class OnlineUserList:
    __instance = None
    def __init__(self):
        if not OnlineUserList.__instance:
            self.user_list=set()
            print("__init__ method called but nothing is created")
        else:
            print("instance already created:", self.getInstance())

    @classmethod
    def getInstance(cls):
        if cls.__instance is None:
            cls.__instance = OnlineUserList()
        return cls.__instance

    def get_user_list(self):
        return self.user_list

    def addUser(self,username,first_name):
        self.user_list.add(json.dumps({"username":username,"first_name":first_name}))

    def removeUser(self,username,first_name):
        self.user_list.discard(json.dumps({"username":username,"first_name":first_name}))


def get_online_user(detail):
    userListObj=OnlineUserList.getInstance()
    userListObj.addUser(detail.get("username"),detail.get("first_name"))

    dict_to_be_send= {
        "handle_type":detail.get("type"),
        "online_users":list(userListObj.get_user_list())
    }
    return dict_to_be_send


def remove_online_user(detail):
    userListObj=OnlineUserList.getInstance()
    userListObj.removeUser(detail.get("username"),detail.get("first_name"))

    dict_to_be_send= {
        "handle_type":"online_users",
        "online_users":list(userListObj.get_user_list())
    }
    return dict_to_be_send

def save_message(detail):
    Message.objects.create(user=User.objects.get(username=detail.get("username")),message=detail.get("message"))

def send_message(detail):
    msg=detail.get("message")
    sentiment = client.Sentiment({'text':msg})
    if sentiment['polarity']=='positive':
        print(sentiment)
        if sentiment['polarity_confidence']<=0.40:
            msg=msg+" :-( "
        elif sentiment['polarity_confidence']>0.40 and sentiment['polarity_confidence']<=0.60:
            msg=msg+" :-| "
        else:
            msg=msg+" :-) "

    elif sentiment['polarity']=='negative':
        if sentiment['polarity_confidence']<=0.40:
            msg=msg+" :-) "
        elif sentiment['polarity_confidence']>0.40 and sentiment['polarity_confidence']<=0.60:
            msg=msg+" :-| "
        else:
            msg=msg+" :-( "
    else:
        msg=msg+" :-| "
    detail.update ({
        "handle_type":"message",
        "message":msg,
    })
    save_message(detail)
    return detail

def makeACall(detail):
    detail.update({"handle_type":"callComing" , "callingPerson":detail.get("username")})
    return detail

def callAccept(detail):
    detail.update({"handle_type":"callAccept"})
    return detail

def myIdAdd(detail):
    detail.update({"handle_type":"myIdAdd"})
    return detail

def get_json_to_send(argument): 
    switcher = { 
        "message": send_message, 
        "online_users": get_online_user, 
        "user_disconnect":remove_online_user,
        "makecall":makeACall,
        "callAccept":callAccept,
        "myIdAdd":myIdAdd
    } 
    # get() method of dictionary data type returns  
    # value of passed argument if it is present  
    # in dictionary otherwise second argument will 
    # be assigned as default value of passed argument 
    return switcher.get(argument, "nothing") 