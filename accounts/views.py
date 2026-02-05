from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
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



@login_required
@csrf_exempt
def api_profile(request):
    user = request.user
    return JsonResponse({
        'status': 'success',
        'user': {
            'id': user.id,
            'email': user.email,
            'full_name': user.full_name,
            'username': user.username,
            'points': user.points,
            'is_staff': user.is_staff,
            'avatar': user.avatar.url if user.avatar else None,
        }
    })


def user_profile(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    context = {
        'profile_user': user,
    }
    return render(request, 'accounts/profile.html', context)


from django.contrib.auth import authenticate, login

@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            user = authenticate(request, email=email, password=password)
            if user:
                login(request, user)
                return JsonResponse({
                    'status': 'success', 
                    'user': {
                        'id': user.id,
                        'email': user.email, 
                        'full_name': user.full_name,
                        'username': user.username
                    }
                })
            return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=400)
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

@csrf_exempt
def api_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            username = data.get('username')
            
            if CustomUser.objects.filter(email=email).exists():
                return JsonResponse({'status': 'error', 'message': 'Email already exists'}, status=400)
            
            user = CustomUser.objects.create_user(
                username=username,
                email=email,
                password=password,
                full_name=username # Default full name to username during signup if not provided
            )
            login(request, user)
            return JsonResponse({
                'status': 'success',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': user.full_name,
                    'username': user.username
                }
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

@csrf_exempt
def api_logout(request):
    from django.contrib.auth import logout
    logout(request)
    return JsonResponse({'status': 'success'})
