from django.db import models
from django.contrib.auth.models import User
from common.createmodifymodels import CreateModifyModel 

class Message(CreateModifyModel):
	message=models.TextField(null=True,blank=True,default="")
	user=models.ForeignKey(User,on_delete=models.CASCADE)