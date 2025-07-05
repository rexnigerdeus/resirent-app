# backend/api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserRegistrationView,
    RenterRegistrationView,
    CustomTokenObtainPairView,
    ResidenceViewSet,
    PublicResidenceListView,     
    PublicResidenceDetailView,
    BookingCreateView,
    OwnerBookingListView,
    BookingStatusUpdateView,
)
from rest_framework_simplejwt.views import TokenRefreshView

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'residences', ResidenceViewSet, basename='residence')

# The API URLs are now determined automatically by the router.
urlpatterns = [
    # Public routes for Browse residences
    path('residences/public/', PublicResidenceListView.as_view(), name='public-residence-list'),
    path('residences/public/<int:pk>/', PublicResidenceDetailView.as_view(), name='public-residence-detail'),

    # Authentication routes
    path('register/owner/', UserRegistrationView.as_view(), name='owner-register'),
    path('register/renter/', RenterRegistrationView.as_view(), name='renter-register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Add the booking creation route
    path('bookings/create/', BookingCreateView.as_view(), name='booking-create'),
    path('owner/bookings/', OwnerBookingListView.as_view(), name='owner-booking-list'),
    path('owner/bookings/<int:pk>/status/', BookingStatusUpdateView.as_view(), name='owner-booking-status-update'),

    # The router URLs
    path('', include(router.urls)),
]