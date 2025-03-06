
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function Home() {
  // Log when component is mounted to help with debugging
  useEffect(() => {
    console.log('Home component mounted, redirecting to calendar');
  }, []);

  // Redirect to calendar by default (wrapped in a div to ensure proper rendering)
  return (
    <div>
      <Navigate to="/calendar" replace />
    </div>
  );
}
