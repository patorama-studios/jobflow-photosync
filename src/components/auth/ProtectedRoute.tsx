import { useAuth } from '@/contexts/MySQLAuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { PageLoading } from '@/components/loading/PageLoading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, isLoading, user } = useAuth();
  const location = useLocation();

  console.log('🔧 ProtectedRoute: Auth state', { 
    hasSession: !!session, 
    hasUser: !!user,
    isLoading, 
    path: location.pathname,
    sessionDetails: session ? 'Session exists' : 'No session',
    userEmail: user?.email
  });

  // Show loading while checking authentication
  if (isLoading) {
    console.log('🔧 ProtectedRoute: Still loading, showing loading screen');
    return <PageLoading message="Verifying authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!session || !user) {
    console.log('🔧 ProtectedRoute: No session or user, redirecting to login', { session: !!session, user: !!user });
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User is authenticated, show the protected content
  console.log('🔧 ProtectedRoute: User authenticated, showing content for:', user.email);
  return <>{children}</>;
};