
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Home() {
  // Simple redirect to calendar without any conditional logic or side effects
  return <Navigate to="/calendar" replace />;
}
