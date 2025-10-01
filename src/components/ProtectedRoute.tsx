import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useLocalAuth } from './LocalAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useLocalAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;