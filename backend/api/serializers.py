# backend/api/serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.utils import timezone
from .models import User, OwnerProfile, Residence, ResidencePhoto, Booking

class OwnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OwnerProfile
        fields = ('address', 'phone_number', 'id_front_photo', 'id_back_photo', 'residences_to_publish')


class OwnerContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email', 'phone_number')


class UserRegistrationSerializer(serializers.ModelSerializer):
    # We include the profile serializer to handle nested creation
    # ADD source='ownerprofile' to this line
    profile = OwnerProfileSerializer(required=True, source='ownerprofile')
    # Make password write-only so it's not returned in the API response
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'first_name', 'last_name', 'profile')

    def create(self, validated_data):
        """
        This custom create method handles creating both the User and the associated OwnerProfile.
        """
        # We now access the profile data via 'ownerprofile' because of the 'source' argument
        profile_data = validated_data.pop('ownerprofile')
        user_phone_number = profile_data.get('phone_number')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone_number=user_phone_number
        )
        
        OwnerProfile.objects.create(
            user=user,
            **profile_data
        )
        
        return user
    
    
# backend/api/serializers.py

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add common custom claims
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        
        try:
            # Try to access the related OwnerProfile
            profile = user.ownerprofile
            token['account_status'] = profile.account_status
            token['role'] = 'owner'
            token['residences_to_publish'] = profile.residences_to_publish 
        except OwnerProfile.DoesNotExist:
            # If the OwnerProfile does not exist, we can assume the user is a Renter.
            token['account_status'] = 'active' # Renters are considered active by default
            token['role'] = 'renter'

        return token
    

class ResidencePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResidencePhoto
        fields = ('id', 'image')


class ResidenceSerializer(serializers.ModelSerializer):
    # This is for reading/displaying photos. It's read-only.
    photos = ResidencePhotoSerializer(many=True, read_only=True)
    
    # This is for accepting file uploads when creating a residence. It's write-only.
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False # Make it optional
    )

    class Meta:
        model = Residence
        fields = (
            'id', 'title', 'description', 'address', 'city', 'country',
            'price_per_night', 'is_available', 'conditions', 'owner',
            'photos', 'uploaded_images', 'created_at'
        )
        # The owner should be the logged-in user, so we make it read-only.
        read_only_fields = ('owner',)

    def create(self, validated_data):
        # Pop the uploaded images data from the validated data
        uploaded_images_data = validated_data.pop('uploaded_images', [])
        
        # Create the residence instance
        residence = Residence.objects.create(**validated_data)
        
        # Create ResidencePhoto instances for each uploaded image
        for image_data in uploaded_images_data:
            ResidencePhoto.objects.create(residence=residence, image=image_data)
            
        return residence
    
    
# A simple serializer to show non-sensitive owner information
class PublicOwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name') # Only show the owner's first name


class PublicResidenceListSerializer(serializers.ModelSerializer):
    """
    A lightweight serializer for the public list view of residences.
    """
    # We can add a field to show the first photo as a thumbnail.
    main_photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Residence
        fields = ('id', 'title', 'city', 'address', 'price_per_night', 'main_photo_url')
    
    def get_main_photo_url(self, residence):
        # Get the first photo associated with the residence
        first_photo = residence.photos.first()
        if first_photo:
            request = self.context.get('request')
            # Build the full URL for the image
            return request.build_absolute_uri(first_photo.image.url)
        return None


class PublicResidenceDetailSerializer(serializers.ModelSerializer):
    """
    A detailed serializer for viewing a single public residence.
    """
    # Use the simple owner serializer to show owner's first name
    owner = PublicOwnerSerializer(read_only=True)
    # Use the photo serializer to list all photos
    photos = ResidencePhotoSerializer(many=True, read_only=True)

    class Meta:
        model = Residence
        fields = (
            'id', 'title', 'description', 'address', 'city', 'country',
            'price_per_night', 'is_available', 'conditions', 'owner',
            'photos', 'created_at'
        )


class BookingSerializer(serializers.ModelSerializer):
    # We make guest and status read-only because they will be set automatically.
    guest = OwnerContactSerializer(read_only=True)
    residence_title = serializers.CharField(source='residence.title', read_only=True)
    status = serializers.CharField()
    price_per_night = serializers.DecimalField(source='residence.price_per_night', read_only=True, max_digits=10, decimal_places=2)
    owner = OwnerContactSerializer(source='residence.owner', read_only=True)

    class Meta:
        model = Booking
        fields = ('id', 'residence', 'residence_title', 'guest', 'check_in_date', 'check_out_date', 'status', 'owner', 'price_per_night')

    def validate(self, data):
        """
        Check that check_in is before check_out, is not in the past,
        and that the residence is not already booked for the chosen dates.
        
        --- THIS LOGIC SHOULD ONLY RUN ON CREATION (POST) ---
        """
        # We access the request context to check the method
        request = self.context.get("request")

        # Only run this validation for POST requests (new bookings)
        if request and request.method == 'POST':
            if 'check_in_date' not in data or 'check_out_date' not in data:
                raise serializers.ValidationError("Check-in and check-out dates are required.")

            if data['check_in_date'] >= data['check_out_date']:
                raise serializers.ValidationError("Check-out date must be after check-in date.")
            
            if data['check_in_date'] < timezone.now().date():
                raise serializers.ValidationError("Check-in date cannot be in the past.")

            residence = data['residence']
            check_in = data['check_in_date']
            check_out = data['check_out_date']
            
            conflicting_bookings = Booking.objects.filter(
                residence=residence,
                status='confirmed',
                check_in_date__lt=check_out,
                check_out_date__gt=check_in,
            )
            
            if conflicting_bookings.exists():
                raise serializers.ValidationError(
                    "This residence is already booked for the selected dates. Please choose different dates."
                )
            
        return data
    

class RenterRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for the simple registration of a renter/guest.
    """
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'first_name', 'last_name', 'phone_number')

    def create(self, validated_data):
        # Create the User instance, but NOT an OwnerProfile.
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            phone_number=validated_data['phone_number']
        )
        return user