from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator


class Category(models.Model):
    """
    Main categories: Music, Sport, Computer Science, Languages, Exam Prep, Soft Skills
    """
    CATEGORY_CHOICES = [
        ('music', 'Music'),
        ('sport', 'Sport'),
        ('computer_science', 'Computer Science'),
        ('languages', 'Languages'),
        ('exam_prep', 'Exam Prep (IELTS/SAT)'),
        ('soft_skills', 'Soft Skills'),
    ]
    
    name = models.CharField(max_length=100, choices=CATEGORY_CHOICES, unique=True)
    display_name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon class name (e.g., 'fa-music')")
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['display_name']
    
    def __str__(self):
        return self.display_name


class SubCategory(models.Model):
    """
    Sub-categories within main categories (e.g., Piano, Python, Football)
    """
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = 'Sub-Categories'
        ordering = ['category', 'name']
        unique_together = ['category', 'name']
    
    def __str__(self):
        return f"{self.category.display_name} → {self.name}"


class Lesson(models.Model):
    """
    Video lessons created by students for other students
    """
    LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    video_url = models.URLField(help_text="YouTube unlisted link or embedded video URL")
    thumbnail = models.ImageField(upload_to='lesson_thumbnails/', blank=True, null=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lessons_created')
    sub_category = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name='lessons')
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='beginner')
    duration = models.CharField(max_length=50, blank=True, help_text="e.g., '15 minutes'")
    
    # Stats
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} by {self.author.full_name}"
    
    def get_youtube_embed_url(self):
        """Convert YouTube URL to embed format"""
        if 'youtube.com/watch?v=' in self.video_url:
            video_id = self.video_url.split('watch?v=')[-1].split('&')[0]
            return f"https://www.youtube.com/embed/{video_id}"
        elif 'youtu.be/' in self.video_url:
            video_id = self.video_url.split('youtu.be/')[-1].split('?')[0]
            return f"https://www.youtube.com/embed/{video_id}"
        return self.video_url


class Assignment(models.Model):
    """
    Assignment associated with each lesson
    """
    lesson = models.OneToOneField(Lesson, on_delete=models.CASCADE, related_name='assignment')
    question_text = models.TextField(help_text="The assignment question or task description")
    max_score = models.IntegerField(default=100)
    allow_file_upload = models.BooleanField(default=True, help_text="Allow students to upload files")
    allow_text_answer = models.BooleanField(default=True, help_text="Allow students to submit text answers")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Assignment for: {self.lesson.title}"


class Submission(models.Model):
    """
    Student submissions for assignments
    """
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submissions')
    answer_text = models.TextField(blank=True, null=True)
    answer_file = models.FileField(
        upload_to='submissions/', 
        blank=True, 
        null=True,
        validators=[FileExtensionValidator(['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'])]
    )
    completed = models.BooleanField(default=False)
    score = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True, null=True, help_text="Feedback from lesson author")
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-submitted_at']
        unique_together = ['assignment', 'user']
    
    def __str__(self):
        status = "✓ Completed" if self.completed else "⋯ Pending"
        return f"{self.user.full_name} - {self.assignment.lesson.title} ({status})"


class Certificate(models.Model):
    """
    Auto-generated certificates for completed lessons
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='certificates')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='certificates')
    certificate_id = models.CharField(max_length=50, unique=True, editable=False)
    pdf_file = models.FileField(upload_to='certificates/', blank=True, null=True)
    issued_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-issued_at']
        unique_together = ['user', 'lesson']
    
    def __str__(self):
        return f"Certificate: {self.user.full_name} - {self.lesson.title}"
    
    def save(self, *args, **kwargs):
        if not self.certificate_id:
            import uuid
            self.certificate_id = f"EDUSHARE-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)


class LessonLike(models.Model):
    """
    Track which users liked which lessons
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='lesson_likes')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='liked_by')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'lesson']
    
    def __str__(self):
        return f"{self.user.full_name} likes {self.lesson.title}"


class Comment(models.Model):
    """
    User comments on lessons
    """
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Comment by {self.user.full_name} on {self.lesson.title}"
