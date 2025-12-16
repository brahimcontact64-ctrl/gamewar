import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireActive?: boolean;
  requireAdmin?: boolean;
  requireSeller?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = false,
  requireActive = false,
  requireAdmin = false,
  requireSeller = false,
}) => {
  const { currentUser, userProfile, loading, isActive, isAdmin, isSeller } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gaming-green text-xl">Loading...</div>
      </div>
    );
  }

  if (requireAuth && !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireActive && !isActive) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireSeller && !isSeller && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
