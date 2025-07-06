// src/services/api.js
import axios from 'axios';

// Create an Axios instance with a base URL.
// All requests made with this instance will be prefixed with this URL.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/',
});

// Function to fetch the list of public residences
export const fetchPublicResidences = () => {
  return apiClient.get('/residences/public/');
};

// Function to fetch details for a single public residence
export const fetchResidenceDetails = (id) => {
  return apiClient.get(`/residences/public/${id}/`);
};

export const registerRenter = (userData) => {
  // userData will be an object with { email, username, password, first_name, last_name }
  return apiClient.post('/register/renter/', userData);
};

// Function to register a new owner
export const registerOwner = (formData) => {
  // Note: The argument is already a FormData object
  return apiClient.post('/register/owner/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Function to create a new booking
export const createBooking = (bookingData) => {
  // bookingData will be { residence, check_in_date, check_out_date }
  return apiClient.post('/bookings/create/', bookingData);
};

// Function to fetch the residences belonging to the logged-in owner
export const fetchOwnerResidences = () => {
  return apiClient.get('/residences/'); // Uses the protected ViewSet endpoint
};

// Function to create a new residence
export const createResidence = (residenceFormData) => {
  // residenceFormData is a FormData object
  return apiClient.post('/residences/', residenceFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// GET a single owner residence for the edit form
export const fetchOwnerResidenceDetails = (id) => {
  return apiClient.get(`/residences/${id}/`);
};

// PATCH (update) an owner's residence
export const updateResidence = (id, residenceFormData) => {
  return apiClient.patch(`/residences/${id}/`, residenceFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const fetchOwnerBookings = () => {
  return apiClient.get('/owner/bookings/');
};

export const updateBookingStatus = (bookingId, status) => {
  return apiClient.patch(`/owner/bookings/${bookingId}/status/`, { status });
};