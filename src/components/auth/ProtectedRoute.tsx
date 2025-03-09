
import { useEffect, useState, memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLoading from '../loading/PageLoading';
import { ErrorBoundary } from '../ErrorBoundary';

export const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const location = useLocation();
  const [localLoading, setLocalLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Enhanced debugging with proper logging
  useEffect(() => {
    console.log('ProtectedRoute rendering for path:', location.pathname, {
      isAuthLoading: isLoading,
      hasSession: !!session,
      localLoading,
      retryCount,
      isDev: import.meta.env.DEV, 
      buildMode: import.meta.env.MODE
    });
    
    // Set a timeout to prevent infinite loading
    const timer = setTimeout(() => {
      if (isLoading && retryCount < 3) {
        console.log('Auth still loading after timeout, retrying...');
        setRetryCount(prev => prev + 1);
      } else if (isLoading && retryCount >= 3) {
        console.log('Multiple retry attempts failed, forcing decision');
        setHasError(true);
        setLocalLoading(false);
      } else {
        setLocalLoading(false);
      }
    }, 2000); // Wait 2 seconds before checking status
    
    return () => clearTimeout(timer);
  }, [isLoading, session, location.pathname, retryCount]); // Removed localLoading from dependencies to avoid infinite loops

  // ALWAYS bypass auth in development mode
  if (import.meta.env.DEV) {
    console.log('DEV MODE: Protected route is bypassing auth check for:', location.pathname);
    return <ErrorBoundary>{children}</ErrorBoundary>;
  }

  // If we've hit an error after multiple retries
  if (hasError) {
    console.error('ProtectedRoute: Authentication error encountered');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-semibold text-red-500 mb-2">Authentication Error</h2>
        <p className="text-gray-600 mb-4">Unable to verify your authentication status</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  // If still in initial auth loading state within reasonable time, show loading
  if (isLoading && localLoading) {
    console.log('ProtectedRoute: Showing loading state');
    return <PageLoading forceRefreshAfter={10} />;
  }

  // For production: redirect to login if definitely not authenticated
  if (!import.meta.env.DEV && !isLoading && !session) {
    console.log('ProtectedRoute - No session, redirecting to login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Either authenticated or forcing decision after timeout or in development mode
  console.log('ProtectedRoute - Rendering protected content for:', location.pathname);
  return <ErrorBoundary>{children}</ErrorBoundary>;
});

ProtectedRoute.displayName = 'ProtectedRoute';
