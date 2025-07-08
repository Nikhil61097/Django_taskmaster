from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    login_view,
    dashboard_view,
    test_api_view,
    manager_view,
    TaskViewSet,
    MyTokenObtainPairView,
    list_users,
    create_user,
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    # Frontend pages
    path('', login_view, name='login'),
    path('dashboard/', dashboard_view, name='dashboard'),
    path('test-api/', test_api_view, name='test-api'),
    path('manager/', manager_view, name='manager'),

    # JWT Auth
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User Management (Manager-only)
    path('api/users/', list_users, name='list-users'),
    path('api/create-user/', create_user, name='create-user'),
    
]

# Add task API endpoints
urlpatterns += router.urls
