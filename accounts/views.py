from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import CustomUser
from .forms import ProfileForm


@login_required
def profile(request):
    user = request.user
    context = {
        'user': user,
    }
    return render(request, 'accounts/profile.html', context)


@login_required
def edit_profile(request):
    if request.method == 'POST':
        form = ProfileForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully!')
            return redirect('accounts:profile')
    else:
        form = ProfileForm(instance=request.user)
    
    context = {
        'form': form,
    }
    return render(request, 'accounts/edit_profile.html', context)


def user_profile(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    context = {
        'profile_user': user,
    }
    return render(request, 'accounts/profile.html', context)
