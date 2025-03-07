
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLoading from '@/components/loading/PageLoading';

export default function Home() {
  const { session, isLoading } = useAuth();

  // If still loading auth state, show loading indicator
  if (isLoading) {
    return <PageLoading forceRefreshAfter={5} />;
  }

  // If not authenticated, go to login
  if (!session) {
    console.log('Home component redirecting to login (no session)');
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated, redirect to calendar
  console.log('Home component redirecting to calendar (authenticated)');
  return <Navigate to="/dashboard" replace />;
}
