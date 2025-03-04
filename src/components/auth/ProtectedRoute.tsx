
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  // Add logging to help debug the issue
  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { isLoading, hasSession: !!session });
  }, [isLoading, session]);

  // Add a fallback mechanism in case loading takes too long
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth loading timeout exceeded - may be stuck in loading state');
        // You can add additional logic here if needed
      }
    }, 5000); // 5 second timeout

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <span className="text-lg font-medium">Loading your dashboard...</span>
        <span className="text-sm text-muted-foreground mt-2">This is taking longer than expected...</span>
      </div>
    );
  }

  if (!session) {
    console.log('ProtectedRoute - No session, redirecting to login');
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated and loaded, render the protected content
  console.log('ProtectedRoute - Authenticated, rendering content');
  return <>{children}</>;
};
