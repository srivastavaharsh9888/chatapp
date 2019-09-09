from django.db import models

from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Q

from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response

from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from rest_framework.decorators import api_view,authentication_classes,permission_classes

from .serializers import UserSerializer,MessageSerializer
from .models import Message

#end point to handle the register
class Register(APIView):

    def post(self, request):
        
        #get the user detail from the frontend
        password = request.data.get("password")
        cnf_pwd = request.data.get("confirm_pwd")
        email = request.data.get("username")
        name = request.data.get("name")

        #pass the detail into the serializer for validation
        user_serializer=UserSerializer(data=request.data)

        #if serializer is valid that is all the validation is passed save the user else return bad request
        if user_serializer.is_valid():

            #create the user
        	user=User.objects.create_user(username=email,password=password,first_name=name)
        	user.is_active = True
        	user.save()
        	return Response({"message":"User created"},status=status.HTTP_200_OK)
        else:
        	return Response({"error":user_serializer.errors},status=status.HTTP_400_BAD_REQUEST)	
        return Response({"message":"User with this email already exists.","flag":False},status=status.HTTP_400_BAD_REQUEST)

#end point to handle the login
class Login(APIView):
    def post(self, request):

        #get the user detail from the frontend
        name = request.data.get("username")
        password = request.data.get("password")
        try:
            #check whether the user exists or not
            user_exists=User.objects.filter(username=name)

            # if does not exist send appropriate message
            if not user_exists.exists():
                return Response({"message":"User with this details not exists.","flag":False},status=status.HTTP_400_BAD_REQUEST)

            # check the password 
            user_obj=authenticate(username=user_exists[0].username,password=password)

            #if user is authenticated 
            if user_obj:

                #if user is authenticated then send the token else return a bad request
                if user_obj.is_active:
                    user_token,created=Token.objects.get_or_create(user=user_obj)
                    return Response({"message":"User Logged in","token":user_token.key,"username":user_obj.username},status=status.HTTP_200_OK)
                else:
                    return Response({"message":"Please activate your mobile number to login.","flag":False}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response({"message":'Password Incorrect',"flag":False},status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'message': 'Please enter a valid username and password.',"details":str(e), "flag":False}, status=status.HTTP_401_UNAUTHORIZED)


#end point to get the message list
class MessageList(generics.ListAPIView):

    #using the token authentication for validating users
    permission_classes = (IsAuthenticated,)
    authentication_classes=(TokenAuthentication,)

    #make use of serializer to data from model and convert it into JSON form
    serializer_class = MessageSerializer

    #query which return the list of messages
    def get_queryset(self):
        return Message.objects.all().select_related('user')

