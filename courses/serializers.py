from rest_framework import serializers
from courses.models import Category, Lesson, Comment, Assignment, Submission
from accounts.models import CustomUser


class UserBasicSerializer(serializers.ModelSerializer):
    """Basic user information for nested serialization"""
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'full_name', 'email', 'avatar', 'avatar_url', 'points', 'is_staff']
        
    def get_avatar_url(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
        return None


class CategorySerializer(serializers.ModelSerializer):
    """Category serializer with lesson count"""
    lessons_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'lessons_count']
        
    def get_lessons_count(self, obj):
        return obj.lessons.count()


class CommentSerializer(serializers.ModelSerializer):
    """Lesson comments with user info"""
    author = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'author', 'content', 'created_at']
        read_only_fields = ['author', 'created_at']


class LessonListSerializer(serializers.ModelSerializer):
    """Lesson list serializer with basic info"""
    category = CategorySerializer(read_only=True)
    author = UserBasicSerializer(read_only=True)
    thumbnail_url = serializers.SerializerMethodField()
    video_file_url = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Lesson
        fields = [
            'id', 'title', 'description', 'category', 'author', 
            'thumbnail', 'thumbnail_url', 'youtube_link', 'video_file', 'video_file_url',
            'duration', 'level', 'views', 'likes', 'is_liked', 'created_at', 'updated_at'
        ]
        
    def get_thumbnail_url(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
        return None
        
    def get_video_file_url(self, obj):
        if obj.video_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.video_file.url)
        return None
        
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.liked_by.filter(id=request.user.id).exists()
        return False


class LessonDetailSerializer(LessonListSerializer):
    """Lesson detail serializer with comments and assignments"""
    comments = CommentSerializer(many=True, read_only=True)
    comments_count = serializers.SerializerMethodField()
    has_assignment = serializers.SerializerMethodField()
    
    class Meta(LessonListSerializer.Meta):
        fields = LessonListSerializer.Meta.fields + ['comments', 'comments_count', 'has_assignment']
        
    def get_comments_count(self, obj):
        return obj.comments.count()
        
    def get_has_assignment(self, obj):
        return hasattr(obj, 'assignment')


class LessonCreateUpdateSerializer(serializers.ModelSerializer):
    """Lesson create/update serializer"""
    
    class Meta:
        model = Lesson
        fields = [
            'title', 'description', 'category', 'thumbnail', 
            'youtube_link', 'video_file', 'duration', 'level'
        ]
        
    def validate(self, data):
        """Ensure either youtube_link or video_file is provided"""
        if not data.get('youtube_link') and not data.get('video_file'):
            raise serializers.ValidationError(
                "Either youtube_link or video_file must be provided"
            )
        return data


class AssignmentSerializer(serializers.ModelSerializer):
    """Assignment serializer"""
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)
    
    class Meta:
        model = Assignment
        fields = ['id', 'lesson', 'lesson_title', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'points']
        read_only_fields = ['correct_answer']  # Hide correct answer from students


class SubmissionSerializer(serializers.ModelSerializer):
    """Assignment submission serializer"""
    assignment_question = serializers.CharField(source='assignment.question_text', read_only=True)
    user = UserBasicSerializer(read_only=True)
    
    class Meta:
        model = Submission
        fields = ['id', 'assignment', 'assignment_question', 'user', 'answer_text', 'answer_file', 'completed', 'score', 'submitted_at']
        read_only_fields = ['user', 'completed', 'score', 'submitted_at']


class EnrollmentSerializer(serializers.Serializer):
    """Serializer for lesson enrollment"""
    lesson_id = serializers.IntegerField()
    
    def validate_lesson_id(self, value):
        try:
            Lesson.objects.get(id=value)
        except Lesson.DoesNotExist:
            raise serializers.ValidationError("Lesson not found")
        return value
