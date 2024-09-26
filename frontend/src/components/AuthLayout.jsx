import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AuthLayout({ allowedR }) {
  const { auth } = useAuth();
  const location = useLocation();

  // Check if the user is authenticated
  if (auth.userdata) {
    // If authenticated, check for role
    return auth.role === allowedR ? (
      <Outlet />
    ) : (
      <Navigate to="/unauthorized" state={{ from: location }} replace />
    );
  }

  // If not authenticated, redirect to login
  return <Navigate to="/login" state={{ from: location }} replace />;
}
