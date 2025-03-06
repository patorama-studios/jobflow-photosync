
import { useEffect, useState, memo, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
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
  children 
}: { 
  children: React.ReactNode 
}) {
  const { session, isLoading } = useAuth();
  const location = useLocation();
  const [longLoadingDetected, setLongLoadingDetected] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Loading progress simulation
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) return prev; // Cap at 90% until actual load
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Loading detection with cleanup
  useEffect(() => {
    if (!isLoading) return;
    
    const timeoutId = setTimeout(() => {
      setLongLoadingDetected(true);
    }, 5000); // Increased from 1500ms to 5000ms to avoid premature error messages

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  // Update progress to 100 when loading completes
  useEffect(() => {
    if (!isLoading && loadingProgress < 100) {
      setLoadingProgress(100);
    }
  }, [isLoading, loadingProgress]);

  // If loading, show the loading spinner
  if (isLoading) {
    return <LoadingSpinner showError={longLoadingDetected} progress={loadingProgress} />;
  }

  // If not logged in, redirect to login page
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, render the children
  return <>{children}</>;
});
