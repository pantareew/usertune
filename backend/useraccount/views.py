from django.shortcuts import render

# Create your views here.
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import UserProfile
from django.contrib.auth.models import User

@csrf_exempt
def login_api(request):
    if request.method == 'POST':
        try:
            # Parse the JSON body
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            # Authenticate the user
            user = authenticate(request, username=email, password=password)
            if user is not None:
                user_profile = UserProfile.objects.get(user=user)

                # Get the needs data
                needs_data = {
                    'elderly': user_profile.elderly,
                    'dyslexia': user_profile.dyslexia,
                    'low_vision': user_profile.low_vision,
                    'color_blindness': user_profile.color_blindness,  # This could be 'protanopia', 'deuteranopia', etc.
                    'diopter_value': user_profile.diopter_value
                }

                return JsonResponse({
                    'success': True,
                    'message': 'Login successful',
                    'token': 'dummy-token',  # Replace with actual token if you're using token-based auth
                    'first_name': user.first_name,  # Include first name in the response
                    'needs': needs_data  # Include the needs data in the response
                }, status=200)
            else:
                # Authentication failed
                return JsonResponse({'success': False, 'message': 'Invalid email or password'}, status=400)
        
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)
        
    # If the request is not POST, return method not allowed
    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)

@csrf_exempt
def signup_api(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Create the user
            user = User.objects.create_user(
                username=data['email'], 
                email=data['email'], 
                password=data['password'], 
                first_name=data['first_name'], 
                last_name=data['last_name']
            )
            
            # Create the user profile 
            UserProfile.objects.create(
                user=user,
                color_blindness=data.get('colorBlindness', None),
                elderly=data.get('elderly', False),
                dyslexia=data.get('dyslexia', False),
                low_vision=data.get('lowVision', False),
                diopter_value = data.get('diopterValue', None) #diopter default value is 0
            )
            
            return JsonResponse({'success': True, 'message': 'Signup successful', 'first_name': user.first_name})
        
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'})