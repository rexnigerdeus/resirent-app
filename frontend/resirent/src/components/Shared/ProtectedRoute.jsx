// src/components/Shared/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  const location = useLocation();

  // 1. Check if the user is logged in
  if (!user) {
    // If not, redirect to the login page, saving the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if the route requires specific roles and if the user has one of them
  //    'user.role' comes from the JWT token we created on the backend.
  if (roles && !roles.includes(user.role)) {
    // If the user's role is not allowed, redirect them to the home page
    return <Navigate to="/" replace />;
  }

  // 3. If all checks pass, render the component
  return children;
};

export default ProtectedRoute;