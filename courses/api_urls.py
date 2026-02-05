from django.urls import path, include
from rest_framework.routers import DefaultRouter
from courses.api_views import (
    CategoryViewSet, LessonViewSet, CommentViewSet,
    AssignmentViewSet, SubmissionViewSet
)

app_name = 'api'

# Create router and register viewsets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'assignments', AssignmentViewSet, basename='assignment')
router.register(r'submissions', SubmissionViewSet, basename='submission')

urlpatterns = [
    path('', include(router.urls)),
]
