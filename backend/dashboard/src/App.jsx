import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Submissions from "./pages/Submissions";
import SubmissionDetail from "./pages/SubmissionDetail";
import { ProtectedRoute } from "./ProtectedRoute";

export default function App() {
  // Use basename for deployment at /dashboard
  const basename = import.meta.env.PROD ? '/dashboard' : '';
  
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/submissions"
          element={
            <ProtectedRoute>
              <Submissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submissions/:id"
          element={
            <ProtectedRoute>
              <SubmissionDetail />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/submissions" replace />} />
      </Routes>
    </BrowserRouter>
  );
}


