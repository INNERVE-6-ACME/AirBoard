from django.urls import path, include
from api import views
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("teams", views.TeamModelViewSet, basename="teams")

urlpatterns = [
    path('', include(router.urls)),
    path('signup/', views.NewUser.as_view()),
    path('session/<int:session_id>', views.SessionAPI.as_view(), name='session'),
    path('addsession', views.CreateDeleteSession.as_view()),
    path('login/', obtain_auth_token, name='login')
]
