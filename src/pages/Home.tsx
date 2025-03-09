
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLoading from '@/components/loading/PageLoading';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Home() {
  const { session, isLoading } = useAuth();
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Add comprehensive logging for debugging
  useEffect(() => {
    console.log('Home component mounted', { 
      isLoading, 
      hasSession: !!session,
      currentPath: window.location.pathname,
      retryCount
    });

    // If we've been loading for more than 3 seconds, try to force a resolution
    const timeoutId = setTimeout(() => {
      if (isLoading && retryCount < 3) {
        console.log('Auth loading timeout reached, forcing update');
        setRetryCount(prev => prev + 1);
      } else if (isLoading && retryCount >= 3) {
        console.log('Multiple retry attempts failed, showing error');
        setHasError(true);
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [isLoading, session, retryCount]);

  // For development environment, bypass auth completely
  if (import.meta.env.DEV) {
    console.log('DEV MODE: Bypassing auth check and redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // If we encounter an error after multiple retries
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-semibold text-red-500 mb-2">Authentication Error</h2>
        <p className="text-gray-600 mb-4">Unable to determine authentication status</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  // If still loading auth state, show loading indicator
  if (isLoading) {
    return <PageLoading forceRefreshAfter={5} />;
  }

  // If not authenticated, go to login
  if (!session) {
    // Add a fallback case to avoid blank screen
    console.log('Home component redirecting to dashboard (no session)');
    return <Navigate to="/dashboard" replace />;
  }
  
  // If authenticated, redirect to dashboard
  console.log('Home component redirecting to dashboard (authenticated)');
  return <Navigate to="/dashboard" replace />;
}
