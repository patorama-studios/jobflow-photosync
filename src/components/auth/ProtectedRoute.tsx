
import { useEffect, useState, memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const location = useLocation();
  const [longLoadingDetected, setLongLoadingDetected] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Enhanced debugging
  useEffect(() => {
    console.log('ProtectedRoute rendering for path:', location.pathname, {
      isLoading,
      hasSession: !!session
    });
    
    // Reset timer when auth state changes
    setTimeElapsed(0);
    setLongLoadingDetected(false);
  }, [isLoading, session, location.pathname]);

  // Timer for loading state
  useEffect(() => {
    if (!isLoading) return;
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setTimeElapsed(elapsed);
      
      if (elapsed >= 3 && !longLoadingDetected) {
        console.warn('Long loading time detected:', elapsed, 'seconds');
        setLongLoadingDetected(true);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isLoading, longLoadingDetected]);

  // Loading state with helpful information
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <span className="text-lg font-medium">Loading your dashboard...</span>
        <span className="text-sm text-muted-foreground mt-1">Time elapsed: {timeElapsed}s</span>
        
        {longLoadingDetected && (
          <div className="mt-4 max-w-md text-center">
            <span className="text-sm text-muted-foreground">
              This is taking longer than expected. You may refresh the page if this continues.
            </span>
            <div className="mt-2 bg-muted rounded-lg p-3 text-xs text-left">
              <p className="font-medium mb-1">Possible solutions:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Check your internet connection</li>
                <li>Clear browser cache and cookies</li>
                <li>Try logging in again from the <a href="/login" className="text-primary underline">login page</a></li>
                <li>Try opening the app in an incognito/private window</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!session) {
    console.log('ProtectedRoute - No session, redirecting to login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  console.log('ProtectedRoute - Successfully authenticated for path:', location.pathname);
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';
