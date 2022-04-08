from email.policy import default
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

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user
    



class TeamSerializer(serializers.ModelSerializer):
    # here UserModelSerializer is used for serialize the value of manytomany to freignkey field, 
    # if not used then we will get only id of teacher and students
    teacher = UserModelSerializer(default=serializers.CurrentUserDefault()) 
    students = UserModelSerializer(many=True, required=False)

    class Meta:
        model = Team
        fields = ('id', 'team_name', 'teacher', 'students', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')
    

# TO GET ALL SESSIONS OF A TEAM WITH MANY=TRUE WITHOUT TEAM DATA
class SessionModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


# TO GET SINGLE SESSION OF A TEAM WITH TEAM DATA
class SingleSessionSerializer(SessionModelSerializer):
    team = TeamSerializer()

