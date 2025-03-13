
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Home() {
  // Simple Home component that redirects to dashboard
  return <Navigate to="/dashboard" replace />;
}
