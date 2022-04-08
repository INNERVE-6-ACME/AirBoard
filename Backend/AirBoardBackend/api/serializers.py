from rest_framework import serializers
from .models import *

class UserModelSerializer(serializers.ModelSerializer):
    is_teacher = serializers.BooleanField(required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'is_teacher')
        extra_kwargs = {
            'password': {'write_only': True}
            }
