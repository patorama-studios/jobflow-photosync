
import { useEffect, useState, memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLoading from '../loading/PageLoading';

export const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const location = useLocation();
  const [checkCount, setCheckCount] = useState(0);

  // Enhanced debugging
  useEffect(() => {
    console.log('ProtectedRoute rendering for path:', location.pathname, {
      isLoading,
      hasSession: !!session,
      checkCount
    });
    
    // Increment check count to track how many render cycles we've gone through
    if (isLoading) {
      setCheckCount(prev => prev + 1);
    } else {
      setCheckCount(0); // Reset when no longer loading
    }
  }, [isLoading, session, location.pathname, checkCount]);

  // Force resolution for stuck loading states
  useEffect(() => {
    // If loading state is stuck for too long (more than 10 render cycles)
    if (isLoading && checkCount > 10) {
      console.warn('Loading state appears to be stuck, forcing navigation to login');
      // In a real app, we might want to show an error message and redirect to login
    }
  }, [isLoading, checkCount]);

  // Loading state
  if (isLoading) {
    return <PageLoading forceRefreshAfter={7} />;
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
