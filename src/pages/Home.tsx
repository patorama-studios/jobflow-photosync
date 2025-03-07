
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function Home() {
  // Log navigation for debugging
  useEffect(() => {
    console.log('Home component mounted, redirecting to calendar');
  }, []);
  
  return <Navigate to="/calendar" replace />;
}
