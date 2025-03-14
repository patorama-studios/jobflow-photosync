
import { useEffect, useState, memo, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { toast } from 'sonner';

// Memoized error component for better performance
const LoadingError = memo(function LoadingError() {
  return (
    <div className="mt-4 max-w-md text-center">
      <span className="text-sm text-muted-foreground">
        Having trouble connecting? Try refreshing the page.
      </span>
      <div className="mt-2 bg-muted rounded-lg p-2 text-xs text-left">
        <p>Quick fixes:</p>
        <ul className="list-disc pl-4 mt-1">
          <li>Check your internet connection</li>
          <li>Clear browser cache</li>
          <li>Try logging in again</li>
        </ul>
      </div>
    </div>
  );
});

// Memoized loading component for better performance
const LoadingSpinner = memo(function LoadingSpinner({ 
  showError,
  progress 
}: { 
  showError: boolean;
  progress: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white dark:bg-gray-950">
      <div className="w-full max-w-md space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
        <Progress value={progress} className="w-full" />
        <div className="text-center space-y-2">
          <span className="text-lg font-medium">Loading your dashboard...</span>
          <p className="text-sm text-muted-foreground">This should only take a moment</p>
        </div>
        {showError && <LoadingError />}
      </div>
    </div>
  );
});

export const ProtectedRoute = memo(function ProtectedRoute({ 
  children,
  requireAuth = true
}: { 
  children: React.ReactNode,
  requireAuth?: boolean
}) {
  const { session, isLoading, user } = useAuth();
  const location = useLocation();
  const [longLoadingDetected, setLongLoadingDetected] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(10);
  const [forceRender, setForceRender] = useState(false);

  // Loading progress simulation
  useEffect(() => {
    if (!isLoading) return;
    
    // Start with initial progress
    setLoadingProgress(10);
    
    // Simulate progress incrementally
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev; // Cap at 90% until actual load
        return prev + 5;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Loading detection with cleanup
  useEffect(() => {
    if (!isLoading) return;
    
    const timeoutId = setTimeout(() => {
      setLongLoadingDetected(true);
    }, 5000); // Show error message after 5 seconds

    // Force render after a timeout as a fallback
    const forceRenderTimeout = setTimeout(() => {
      if (isLoading) {
        console.log('Force rendering due to loading timeout');
        setForceRender(true);
      }
    }, 8000); // Force render after 8 seconds if still loading

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(forceRenderTimeout);
    };
  }, [isLoading]);

  // Update progress to 100 when loading completes
  useEffect(() => {
    if (!isLoading && loadingProgress < 100) {
      setLoadingProgress(100);
    }
  }, [isLoading, loadingProgress]);

  // Notify user when accessing protected route while not authenticated
  useEffect(() => {
    if (!isLoading && !session && !import.meta.env.DEV && requireAuth) {
      toast.error('Authentication required', {
        description: 'You need to log in to access this page',
        duration: 4000,
      });
    }
  }, [isLoading, session, location.pathname, requireAuth]);

  // If loading and not force rendering, show the loading spinner
  if (isLoading && !forceRender) {
    return <LoadingSpinner showError={longLoadingDetected} progress={loadingProgress} />;
  }

  // ALWAYS bypass auth check in development mode or if requireAuth is false
  if (import.meta.env.DEV || !requireAuth) {
    return <>{children}</>;
  }

  // If not logged in and requiring auth, redirect to login page
  if (!session && requireAuth) {
    // Save the current path so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in or not requiring auth, render the children
  return <>{children}</>;
});
