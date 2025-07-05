# backend/api/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser

# It's best practice to use a custom user model from the start.
class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    
    # We will use email as the unique identifier for login instead of username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        return self.email

class OwnerProfile(models.Model):
    ACCOUNT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('suspended', 'Suspended'),
    ]

    # This creates a one-to-one link to the main User model
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    
    # Owner-specific fields
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    id_front_photo = models.ImageField(upload_to='id_documents/')
    id_back_photo = models.ImageField(upload_to='id_documents/')
    residences_to_publish = models.PositiveIntegerField(default=1)
    account_status = models.CharField(
        max_length=10,
        choices=ACCOUNT_STATUS_CHOICES,
        default='pending' # New accounts will be pending approval by default
    )

    def __str__(self):
        return f"Profile of {self.user.first_name} {self.user.last_name}"


class Residence(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='residences')
    title = models.CharField(max_length=200)
    description = models.TextField()
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)
    conditions = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class ResidencePhoto(models.Model):
    residence = models.ForeignKey(Residence, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='residence_photos/')

    def __str__(self):
        return f"Photo for {self.residence.title}"


class Booking(models.Model):
    BOOKING_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    guest = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    residence = models.ForeignKey(Residence, on_delete=models.CASCADE, related_name='bookings')
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    status = models.CharField(
        max_length=10,
        choices=BOOKING_STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking for {self.residence.title} by {self.guest.first_name}"