# backend/api/views.py
from rest_framework import generics, permissions, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User, Residence, Booking
from .serializers import (
    UserRegistrationSerializer,
    CustomTokenObtainPairSerializer,
    ResidenceSerializer,
    PublicResidenceListSerializer,
    PublicResidenceDetailSerializer,
    BookingSerializer,
    RenterRegistrationSerializer,
    OwnerContactSerializer,
)
from .permissions import IsActiveOwner

class UserRegistrationView(generics.CreateAPIView):
    """
    An API endpoint for new users to register.
    This is a public endpoint, so we use AllowAny permission.
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,) # This makes the endpoint public
    serializer_class = UserRegistrationSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    A custom view for the login endpoint that uses our custom serializer.
    """
    serializer_class = CustomTokenObtainPairSerializer


class ResidenceViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions for Residences.
    """
    serializer_class = ResidenceSerializer
    permission_classes = [IsActiveOwner] # Apply our custom permission

    def get_queryset(self):
        """
        This view should only return a list of the residences
        for the currently authenticated user.
        """
        return Residence.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """
        Assign the currently logged-in user as the owner of the residence
        AND check if they are within their publication limit.
        """
        owner = self.request.user
        profile = owner.ownerprofile

        # Count the number of residences the owner already has
        current_residence_count = Residence.objects.filter(owner=owner).count()
        
        # Check if they have reached their limit
        if current_residence_count >= profile.residences_to_publish:
            raise PermissionDenied(
                "Vous avez atteint votre limite de résidences publiées. Veuillez contacter l'administrateur pour mettre à niveau votre forfait."
            )
        
        # If the check passes, create the residence
        serializer.save(owner=owner)


class PublicResidenceListView(generics.ListAPIView):
    """
    A view to list all available residences for any public user.
    """
    permission_classes = [AllowAny]
    serializer_class = PublicResidenceListSerializer

    # The queryset ensures we only show available residences from active owners
    queryset = Residence.objects.filter(is_available=True, owner__ownerprofile__account_status='active')


class PublicResidenceDetailView(generics.RetrieveAPIView):
    """
    A view to retrieve the details of a single available residence.
    """
    permission_classes = [AllowAny]
    serializer_class = PublicResidenceDetailSerializer
    queryset = Residence.objects.filter(is_available=True, owner__ownerprofile__account_status='active')
    lookup_field = 'pk' # pk means "primary key", which is the residence ID


class BookingCreateView(generics.CreateAPIView):
    """
    An endpoint for creating a new booking.
    Only authenticated users can create bookings.
    """
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated] # Ensures only logged-in users can book

    def perform_create(self, serializer):
        """
        Assign the currently logged-in user as the guest for the booking.
        """
        serializer.save(guest=self.request.user)
        

class RenterRegistrationView(generics.CreateAPIView):
    """
    An API endpoint for new renters to register.
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RenterRegistrationSerializer


class OwnerBookingListView(generics.ListAPIView):
    """
    Returns a list of all bookings for the currently authenticated owner's residences.
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter bookings to only those for residences owned by the request user
        return Booking.objects.filter(residence__owner=self.request.user).order_by('-created_at')

class BookingStatusUpdateView(generics.UpdateAPIView):
    """
    Allows the owner of a residence to update a booking's status (confirm or cancel).
    """
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = Booking.objects.all()

    def get_queryset(self):
        # Ensure the owner can only update bookings for their own residences
        return super().get_queryset().filter(residence__owner=self.request.user)

    def perform_update(self, serializer):
        # We only allow updating the status field
        serializer.save(status=self.request.data.get('status'))