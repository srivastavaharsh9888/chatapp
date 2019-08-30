from django.db import models

class CreateModifyModel(models.Model):
    class Meta:
        abstract = True
    created_at=models.DateTimeField(auto_now_add=True)
    modified_at=models.DateTimeField(auto_now=True)
    
