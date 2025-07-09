from django.contrib.auth.models import User
from django.db import models
from django.conf import settings

class Task(models.Model):
    title = models.CharField(max_length=255)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)  # for ordering

    def __str__(self):
        return self.title