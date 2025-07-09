from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    login_view,
    dashboard_view,
    test_api_view,
    manager_view,
    TaskViewSet,
    list_users,
    create_user,
    logout_view,
    delete_user,
)
from rest_framework_simplejwt.views import TokenRefreshView
from .views import TaskViewSet

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    # Frontend pages
    path('', login_view, name='login'),
    path('dashboard/', dashboard_view, name='dashboard'),
    path('manager/', manager_view, name='manager'),
    
    # User Management (Manager-only)
    path('api/users/', list_users, name='list-users'),
    path('api/create-user/', create_user, name='create-user'),


    path('logout/', logout_view, name='logout'),

    path('api/users/<int:pk>/', delete_user, name='delete-user'),

    
]

# Add task API endpoints
urlpatterns += router.urls
