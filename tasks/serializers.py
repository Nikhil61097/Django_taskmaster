from rest_framework import serializers
from .models import Task
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# class TaskSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Task
#         fields = ['id', 'title', 'description', 'completed', 'created_at', 'user']
#         read_only_fields = ['user']


class TaskSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'title', 'completed', 'user', 'username']