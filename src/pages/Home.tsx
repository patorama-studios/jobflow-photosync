
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

    // If we've been loading for more than 2 seconds, try to force a resolution
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
    }, 2000); // Reduced from 3000 to 2000ms for faster fallback

    return () => clearTimeout(timeoutId);
  }, [isLoading, session, retryCount]);

  // ALWAYS go to dashboard in development mode or if we have loading issues
  if (import.meta.env.DEV || loadingTimeout) {
    console.log('DEV MODE or loading timeout: Redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // If we encounter an error after multiple retries
  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-semibold text-red-500 mb-2">Authentication Error</h2>
        <p className="text-gray-600 mb-4">Unable to determine authentication status</p>
        <button 
          onClick={() => window.location.href = "/dashboard"} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // If still loading auth state within reasonable time, show loading indicator
  if (isLoading && !loadingTimeout) {
    return <PageLoading forceRefreshAfter={3} />; // Reduced from 5 to 3 seconds
  }

  // Fallback: redirect to dashboard in all cases to avoid blank screen
  console.log('Home component using fallback redirect to dashboard');
  return <Navigate to="/dashboard" replace />;
}
