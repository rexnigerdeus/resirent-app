// src/contexts/AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiClient } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [tokens, setTokens] = useState(() => {
    const storedTokens = localStorage.getItem('authTokens');
    return storedTokens ? JSON.parse(storedTokens) : null;
  });

  const [user, setUser] = useState(() => {
    const storedTokens = localStorage.getItem('authTokens');
    if (storedTokens) {
      try {
        return jwtDecode(JSON.parse(storedTokens).access);
      } catch (error) {
        return null;
      }
    }
    return null;
  });

  const loginUser = async (email, password) => {
    try {
      const response = await apiClient.post('/login/', { email, password });
      const data = response.data;
      setTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const logoutUser = () => {
    setTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
  };
  
  // --- NEW: USE-EFFECT FOR TOKEN REFRESH ---
  useEffect(() => {
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response, // Pass through successful responses
      async (error) => {
        const originalRequest = error.config;
        
        // If the error is 401 and it's not a request to the refresh URL itself
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true; // Mark to prevent infinite loops

          try {
            const oldTokens = JSON.parse(localStorage.getItem('authTokens'));
            const refresh = oldTokens?.refresh;

            if (!refresh) {
              logoutUser(); // No refresh token available
              return Promise.reject(error);
            }
            
            // Request a new access token
            const response = await apiClient.post('/login/refresh/', { refresh });
            const newTokens = response.data;

            // Update state and localStorage with the new tokens
            localStorage.setItem('authTokens', JSON.stringify(newTokens));
            setTokens(newTokens);
            setUser(jwtDecode(newTokens.access));
            
            // Update the header of the original failed request with the new token
            originalRequest.headers['Authorization'] = `Bearer ${newTokens.access}`;
            
            // Retry the original request
            return apiClient(originalRequest);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            logoutUser(); // If refresh fails, log the user out
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    // This is a request interceptor we already had, but it's good practice
    // to update the apiClient default headers when tokens change as well.
    const requestInterceptor = apiClient.interceptors.request.use(config => {
      const authTokens = localStorage.getItem('authTokens');
      if (authTokens) {
        const token = JSON.parse(authTokens).access;
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Cleanup function to remove interceptors when the component unmounts
    return () => {
      apiClient.interceptors.response.eject(responseInterceptor);
      apiClient.interceptors.request.eject(requestInterceptor);
    };

  }, []); // The empty array ensures this effect runs only once on mount


  const contextData = {
    user,
    tokens,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};