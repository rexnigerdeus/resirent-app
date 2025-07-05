# backend/api/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OwnerProfile, Residence, ResidencePhoto, Booking

# This allows us to edit the OwnerProfile directly from the User admin page
class OwnerProfileInline(admin.StackedInline):
    model = OwnerProfile
    can_delete = False
    verbose_name_plural = 'Owner Profile'
    # Customize which fields are shown
    fields = ('address', 'phone_number', 'id_front_photo', 'id_back_photo', 'residences_to_publish', 'account_status')

# Define a new User admin that includes the OwnerProfile
class UserAdmin(BaseUserAdmin):
    inlines = (OwnerProfileInline,)
    # We add 'get_account_status' to the columns shown in the user list
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'get_account_status')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    
    # We need to define this custom method to display the status
    @admin.display(description='Account Status')
    def get_account_status(self, instance):
        try:
            # get_account_status_display() returns the human-readable value (e.g., "Pending")
            return instance.ownerprofile.get_account_status_display()
        except OwnerProfile.DoesNotExist:
            return 'No Profile'

# This allows us to add/edit photos from the Residence admin page
class ResidencePhotoInline(admin.TabularInline):
    model = ResidencePhoto
    extra = 1  # Show one extra blank photo form by default

class ResidenceAdmin(admin.ModelAdmin):
    inlines = [ResidencePhotoInline]
    list_display = ('title', 'owner', 'city', 'price_per_night', 'is_available')
    list_filter = ('is_available', 'city', 'country')
    search_fields = ('title', 'description', 'owner__email')

class BookingAdmin(admin.ModelAdmin):
    list_display = ('residence', 'guest', 'check_in_date', 'check_out_date', 'status')
    list_filter = ('status', 'check_in_date')
    search_fields = ('residence__title', 'guest__email')


# Register our models with their custom admin options
admin.site.register(User, UserAdmin)
admin.site.register(Residence, ResidenceAdmin)
admin.site.register(Booking, BookingAdmin)