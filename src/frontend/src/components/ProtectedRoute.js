import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  // Nếu chưa đăng nhập, chuyển hướng về trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;