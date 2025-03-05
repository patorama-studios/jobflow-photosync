
import { useEffect, useState, memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const location = useLocation();
  const [longLoadingDetected, setLongLoadingDetected] = useState(false);

  // Loading detection
  useEffect(() => {
    if (!isLoading) return;
    
    const timeoutId = setTimeout(() => {
      setLongLoadingDetected(true);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';
