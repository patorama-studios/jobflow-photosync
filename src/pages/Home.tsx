
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function Home() {
  // Simple, direct redirect to calendar
  console.log('Home component redirecting to calendar');
  return <Navigate to="/calendar" replace />;
}
