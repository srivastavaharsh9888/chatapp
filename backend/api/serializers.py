from django.contrib.auth.models import User
from rest_framework import serializers

from rest_framework.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

from .models import Message

class UserSerializer(serializers.ModelSerializer):

	def validate_password(self,password):
		valid_password=validate_password(password)		
		if self.initial_data["confirm_pwd"]!=password:
			raise ValidationError("Both Confirm Password and Password should be same.")
		return password

	class Meta:
		model = User
		fields='__all__'

	
class MessageSerializer(serializers.ModelSerializer):
	username=serializers.ReadOnlyField(source='user.username',read_only=True)
	first_name=serializers.ReadOnlyField(source='user.first_name',read_only=True)	
	
	class Meta:
		model=Message
		fields='__all__'
		extra_kwargs={'user':{'required':False}}
		extra_fields=['username','first_name']

