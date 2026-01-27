from django.contrib import admin
from .models import Category, SubCategory, Lesson, Assignment, Submission, Certificate, LessonLike


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'name', 'icon', 'created_at']
    search_fields = ['display_name', 'name']


@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'created_at']
    list_filter = ['category']
    search_fields = ['name']


class AssignmentInline(admin.StackedInline):
    model = Assignment
    extra = 0


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'sub_category', 'level', 'views', 'likes', 'is_published', 'created_at']
    list_filter = ['level', 'is_published', 'sub_category__category', 'created_at']
    search_fields = ['title', 'description', 'author__full_name']
    readonly_fields = ['views', 'likes']
    inlines = [AssignmentInline]


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ['lesson', 'max_score', 'allow_file_upload', 'allow_text_answer', 'created_at']
    list_filter = ['allow_file_upload', 'allow_text_answer']
    search_fields = ['lesson__title', 'question_text']


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['user', 'assignment', 'completed', 'score', 'submitted_at']
    list_filter = ['completed', 'submitted_at']
    search_fields = ['user__full_name', 'assignment__lesson__title']
    readonly_fields = ['submitted_at', 'updated_at']


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ['certificate_id', 'user', 'lesson', 'issued_at']
    list_filter = ['issued_at']
    search_fields = ['user__full_name', 'lesson__title', 'certificate_id']
    readonly_fields = ['certificate_id', 'issued_at']


@admin.register(LessonLike)
class LessonLikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__full_name', 'lesson__title']
