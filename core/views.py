from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from courses.models import Category, Lesson, Certificate
from accounts.models import CustomUser


def home(request):
    """
    Home page with featured lessons and categories
    """
    categories = Category.objects.all()
    recent_lessons = Lesson.objects.filter(is_published=True).order_by('-created_at')[:6]
    popular_lessons = Lesson.objects.filter(is_published=True).order_by('-views', '-likes')[:6]
    
    context = {
        'categories': categories,
        'recent_lessons': recent_lessons,
        'popular_lessons': popular_lessons,
    }
    return render(request, 'core/home.html', context)


def about(request):
    """
    About page
    """
    total_lessons = Lesson.objects.filter(is_published=True).count()
    total_users = CustomUser.objects.count()
    total_certificates = Certificate.objects.count()
    
    context = {
        'total_lessons': total_lessons,
        'total_users': total_users,
        'total_certificates': total_certificates,
    }
    return render(request, 'core/about.html', context)


def leaderboard(request):
    """
    Leaderboard showing top contributors
    """
    top_contributors = CustomUser.objects.all().order_by('-points')[:20]
    
    context = {
        'top_contributors': top_contributors,
    }
    return render(request, 'core/leaderboard.html', context)
