# backend/core/urls.py

from django.contrib import admin
from django.urls import path, include
# Add these two imports
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # We will add our api urls here in the next step
    path('api/', include('api.urls')),
]

# Add this line to serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)