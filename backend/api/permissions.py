# backend/api/permissions.py

from rest_framework import permissions

class IsActiveOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners with an 'active' account status.
    """
    message = 'Your owner account is not active. Please wait for admin approval.'

    def has_permission(self, request, view):
        # Check if the user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Check if the authenticated user has an active owner profile
        try:
            return request.user.ownerprofile.account_status == 'active'
        except:
            # If they don't have a profile or some other error occurs
            return False