
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Home() {
  // Redirect to calendar by default
  return <Navigate to="/calendar" replace />;
}
