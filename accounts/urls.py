from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('', views.profile, name='profile'),
    path('edit/', views.edit_profile, name='edit_profile'),
    path('<int:user_id>/', views.user_profile, name='user_profile'),
    path('profile/', views.api_profile, name='api_profile'),
    path('login/', views.api_login, name='api_login'),
    path('signup/', views.api_signup, name='api_signup'),
    path('logout/', views.api_logout, name='api_logout'),
]
