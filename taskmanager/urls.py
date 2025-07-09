from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include('tasks.urls')),
    # All frontend + API views from tasks app
    path('', include('tasks.urls')),
]
