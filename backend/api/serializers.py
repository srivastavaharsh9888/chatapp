from django.contrib.auth.models import User
from rest_framework import serializers

from rest_framework.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

from .models import Message

#Serializer for the user login and registration
class UserSerializer(serializers.ModelSerializer):

	#function for validating password and confirm password
	def validate_password(self,password):

		#validation password security
		valid_password=validate_password(password)		

		#checking if the confirm password is same as password
		if self.initial_data["confirm_pwd"]!=password:
			raise ValidationError("Both Confirm Password and Password should be same.")
		return password

	class Meta:
		model = User
		fields='__all__'

#Serializer to get the list of messages	
class MessageSerializer(serializers.ModelSerializer):

	#extra keyword username and first_name use for display of name on frontend
	username=serializers.ReadOnlyField(source='user.username',read_only=True)
	first_name=serializers.ReadOnlyField(source='user.first_name',read_only=True)	
	
	class Meta:
		model=Message
		fields='__all__'
		extra_kwargs={'user':{'required':False}}
		extra_fields=['username','first_name']

