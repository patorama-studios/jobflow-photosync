
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLoading from '@/components/loading/PageLoading';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Home() {
  const { session, isLoading } = useAuth();
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Add comprehensive logging for debugging
  useEffect(() => {
    console.log('Home component mounted', { 
      isLoading, 
      hasSession: !!session,
      currentPath: window.location.pathname,
      retryCount,
      buildMode: import.meta.env.MODE,
      isDev: import.meta.env.DEV
    });

    // If we've been loading for more than 3 seconds, try to force a resolution
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Auth loading timeout reached, forcing update');
        setLoadingTimeout(true);
        if (retryCount < 3) {
          setRetryCount(prev => prev + 1);
        } else if (retryCount >= 3) {
          console.log('Multiple retry attempts failed, showing error');
          setHasError(true);
        }
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [isLoading, session, retryCount]);

  // ALWAYS bypass auth in development mode
  if (import.meta.env.DEV) {
    console.log('DEV MODE: Bypassing auth check and redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // If loading takes too long but we haven't exceeded retries
  if (loadingTimeout && retryCount < 3) {
    console.log('Auth loading taking too long, attempting to continue...');
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

  // If still loading auth state within reasonable time, show loading indicator
  if (isLoading && !loadingTimeout) {
    return <PageLoading forceRefreshAfter={5} />;
  }

  // Fallback: redirect to dashboard in all cases to avoid blank screen
  console.log('Home component using fallback redirect to dashboard');
  return <Navigate to="/dashboard" replace />;
}
