from django.shortcuts import render, redirect
from rest_framework import viewsets
from .models import Task
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth import authenticate, login, logout
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import TaskSerializer
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status




class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    queryset = Task.objects.all()
    

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Task.objects.all().order_by('-created_at')
        else:
            return Task.objects.filter(user=user).order_by('-created_at')

def perform_create(self, serializer):
        user = self.request.user
        if user.is_staff:
            # Manager can assign task to any user via 'user' field in request data
            assigned_user_id = self.request.data.get('user')
            if assigned_user_id:
                try:
                    assigned_user = User.objects.get(id=assigned_user_id)
                    serializer.save(user=assigned_user)
                except User.DoesNotExist:
                    serializer.save(user=None)  # Assign None if invalid user id
            else:
                serializer.save(user=None)  # No user assigned means unassigned task
        else:
            # Normal user can only assign task to self
            serializer.save(user=user)

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            # Redirect based on role
            if user.is_staff:
                return redirect('/manager/')
            else:
                return redirect('/dashboard/')
        else:
            return render(request, 'login.html', {'error': 'Invalid credentials'})

    return render(request, 'login.html')

def dashboard_view(request):
    return render(request, 'dashboard.html')

def test_api_view(request):
    return render(request, 'test_api.html')

@login_required
def dashboard_view(request):
    return render(request, 'dashboard.html')

@user_passes_test(lambda u: u.is_staff, login_url='/')
@login_required
def manager_view(request):
    return render(request, 'manager.html')


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=400)

    User.objects.create_user(username=username, password=password)
    return Response({'message': 'User created successfully.'}, status=201)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_users(request):
    users = User.objects.all().values('id', 'username')
    return Response(users)

@login_required
def logout_view(request):
    logout(request)
    return redirect('/')

def perform_create(self, serializer):
    user = self.request.user
    if user.is_staff:
        # Managers can assign a user explicitly
        assigned_user_id = self.request.data.get('user')
        if assigned_user_id:
            from django.contrib.auth.models import User
            try:
                assigned_user = User.objects.get(id=assigned_user_id)
                serializer.save(user=assigned_user)
            except User.DoesNotExist:
                serializer.save(user=None)  # fallback to None
        else:
            serializer.save(user=None)
    else:
        # Normal users can only create tasks for themselves
        serializer.save(user=user)

def perform_create(self, serializer):
    if self.request.user.is_staff:
        # allow manager to assign any user
        serializer.save()
    else:
        # auto-assign the logged-in user
        serializer.save(user=self.request.user)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
        user.delete()
        return Response({'message': 'User deleted'}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)