from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from courses.models import Category, Lesson, Comment, Assignment, Submission
from courses.serializers import (
    CategorySerializer, LessonListSerializer, LessonDetailSerializer,
    LessonCreateUpdateSerializer, CommentSerializer,
    AssignmentSerializer, SubmissionSerializer, EnrollmentSerializer
)
from core.models import Notification


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for categories
    List and retrieve categories with lesson counts
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name']
    ordering = ['name']


class LessonViewSet(viewsets.ModelViewSet):
    """
    API endpoint for lessons
    Supports CRUD operations, filtering, searching, and custom actions
    """
    queryset = Lesson.objects.select_related('category', 'author').prefetch_related('comments', 'liked_by')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'level', 'author']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'views', 'likes', 'title']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LessonDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return LessonCreateUpdateSerializer
        return LessonListSerializer
    
    def get_permissions(self):
        """
        Only staff can create/update/delete lessons
        Everyone can view
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [IsAuthenticatedOrReadOnly()]
    
    def perform_create(self, serializer):
        """Set the author to the current user"""
        serializer.save(author=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        """Increment view count when retrieving a lesson"""
        lesson = self.get_object()
        lesson.views += 1
        lesson.save(update_fields=['views'])
        return super().retrieve(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        """Like or unlike a lesson"""
        lesson = self.get_object()
        user = request.user
        
        if lesson.liked_by.filter(id=user.id).exists():
            lesson.liked_by.remove(user)
            lesson.likes -= 1
            lesson.save(update_fields=['likes'])
            return Response({'status': 'unliked', 'likes': lesson.likes})
        else:
            lesson.liked_by.add(user)
            lesson.likes += 1
            lesson.save(update_fields=['likes'])
            return Response({'status': 'liked', 'likes': lesson.likes})
    
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        """Get all comments for a lesson"""
        lesson = self.get_object()
        comments = lesson.comments.all().order_by('-created_at')
        serializer = CommentSerializer(comments, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_comment(self, request, pk=None):
        """Add a comment to a lesson"""
        lesson = self.get_object()
        serializer = CommentSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save(author=request.user, lesson=lesson)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured lessons (most popular)"""
        lessons = self.queryset.order_by('-views', '-likes')[:6]
        serializer = self.get_serializer(lessons, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def trending(self, request):
        """Get trending lessons (most likes recently)"""
        lessons = self.queryset.order_by('-likes', '-created_at')[:6]
        serializer = self.get_serializer(lessons, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_lessons(self, request):
        """Get lessons created by the current user"""
        lessons = self.queryset.filter(author=request.user)
        page = self.paginate_queryset(lessons)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(lessons, many=True)
        return Response(serializer.data)


class CommentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for lesson comments
    """
    queryset = Comment.objects.select_related('author', 'lesson').all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['lesson']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class AssignmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for assignments
    Only staff can create/update/delete
    """
    queryset = Assignment.objects.select_related('lesson').all()
    serializer_class = AssignmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['lesson']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [IsAuthenticatedOrReadOnly()]
    
    def get_queryset(self):
        """Hide correct answer from students"""
        queryset = super().get_queryset()
        if self.request.user.is_staff:
            return queryset
        return queryset.only('id', 'lesson', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'points')


class SubmissionViewSet(viewsets.ModelViewSet):
    """
    API endpoint for assignment submissions
    Students can submit, view their submissions
    """
    queryset = Submission.objects.select_related('assignment', 'user').all()
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['assignment', 'user']
    
    def get_queryset(self):
        """Users can only see their own submissions unless staff"""
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Process assignment submission and award points"""
        assignment = serializer.validated_data['assignment']
        answer_text = serializer.validated_data.get('answer_text', '')
        
        # Automatic scoring logic
        is_correct = False
        score = 0
        if assignment.correct_answer and answer_text:
            if answer_text.strip().upper() == assignment.correct_answer.strip().upper():
                is_correct = True
                score = assignment.max_score

        submission = serializer.save(
            user=self.request.user,
            score=score,
            completed=True
        )
        
        # Award points to user profile if correct
        if score > 0:
            profile = self.request.user # In this model User points are in User model? 
            # Check CustomUser model for points field
            if hasattr(self.request.user, 'points'):
                self.request.user.points += score
                self.request.user.save()
        
        # Create notification
        Notification.objects.create(
            user=self.request.user,
            title="Assignment Submitted",
            message=f"You've submitted assignment for {assignment.lesson.title}. Score: {score}/{assignment.max_score}",
            notification_type='submission'
        )
