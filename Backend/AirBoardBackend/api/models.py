from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
# TABLE FOR STUDENT AND TEACHER INFORMATION
class User(AbstractUser):
    is_teacher = models.BooleanField(default=False)


# TABLE FOR EVERY CLASS/TEAM INFORMATION
class Team(models.Model):
    team_name = models.CharField(max_length=50)
    teacher = models.ForeignKey('User', on_delete=models.CASCADE, null=False)
    students = models.ManyToManyField('User', related_name='students')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



# TABLE FOR SESSION INFORMATION IN ALL TEAMS
class Session(models.Model):
    session_name = models.CharField(max_length=100)
    team = models.ForeignKey('Team', on_delete=models.CASCADE, null=False)
    board = models.FileField(upload_to="images", max_length=100)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


