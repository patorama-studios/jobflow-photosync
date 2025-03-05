
import { useEffect, useState, memo, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const location = useLocation();
  const [longLoadingDetected, setLongLoadingDetected] = useState(false);

  // Simplified logging with less overhead
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('ProtectedRoute - Auth state:', { isLoading, hasSession: !!session });
    }
  }, [isLoading, session]);

  // More efficient loading detection
  useEffect(() => {
    // Only set timers if still loading
    if (!isLoading) return;
    
    const timeoutId = setTimeout(() => {
      setLongLoadingDetected(true);
    }, 1500); // Reduced from 2 seconds to 1.5 seconds for faster feedback

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  // Early return pattern for better performance
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <span className="text-lg font-medium">Loading your dashboard...</span>
        {longLoadingDetected && (
          <div className="mt-4 max-w-md text-center">
            <span className="text-sm text-muted-foreground">This is taking longer than expected. You may refresh the page if this continues.</span>
            <div className="mt-2 bg-muted rounded-lg p-2 text-xs text-left">
              <p>Possible solutions:</p>
              <ul className="list-disc pl-4 mt-1">
                <li>Check your internet connection</li>
                <li>Clear browser cache</li>
                <li>Try logging in again</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!session) {
    if (process.env.NODE_ENV === 'development') {
      console.log('ProtectedRoute - No session, redirecting to login');
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated and loaded, render the protected content
  if (process.env.NODE_ENV === 'development') {
    console.log('ProtectedRoute - Authenticated, rendering content');
  }
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';
