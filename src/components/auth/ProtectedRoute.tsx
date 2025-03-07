
import { useEffect, useState, memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PageLoading from '../loading/PageLoading';

export const ProtectedRoute = memo(({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const location = useLocation();
  const [localLoading, setLocalLoading] = useState(true);
  
  // Enhanced debugging with proper logging
  useEffect(() => {
    console.log('ProtectedRoute rendering for path:', location.pathname, {
      isAuthLoading: isLoading,
      hasSession: !!session,
      localLoading
    });
    
    // Set a timeout to prevent infinite loading
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 3000); // Wait max 3 seconds before forcing decision
    
    return () => clearTimeout(timer);
  }, [isLoading, session, location.pathname, localLoading]);

  // If still in initial auth loading state within reasonable time, show loading
  if (isLoading && localLoading) {
    return <PageLoading forceRefreshAfter={10} />;
  }

  // Redirect to login if definitely not authenticated
  if (!isLoading && !session) {
    console.log('ProtectedRoute - No session, redirecting to login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Either authenticated or forcing decision after timeout
  console.log('ProtectedRoute - Rendering protected content for:', location.pathname);
  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';
