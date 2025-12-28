import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ element, requiredRole = 'admin' }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const userRole = user?.user_metadata?.role || profile?.role;
  const isAdmin = userRole === 'admin';

  if (!isAdmin) {
    return <Navigate to="/signin" replace />;
  }

  return element;
};

export default ProtectedRoute;
