import React from "react";
import { Navigate } from "react-router-dom";
import { isAdminLoggedIn } from "./auth";

export function ProtectedRoute({ children }) {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}


