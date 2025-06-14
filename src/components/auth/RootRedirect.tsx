import { useAuth } from '@/contexts/MySQLAuthContext';
import { Navigate } from 'react-router-dom';
import { PageLoading } from '@/components/loading/PageLoading';

export const RootRedirect: React.FC = () => {
  const { session, isLoading } = useAuth();

  console.log('🔧 RootRedirect: Auth state', { hasSession: !!session, isLoading });

  // Show loading while checking authentication
  if (isLoading) {
    return <PageLoading message="Loading application..." />;
  }

  // Redirect based on authentication status
  if (session) {
    console.log('🔧 RootRedirect: User authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  } else {
    console.log('🔧 RootRedirect: User not authenticated, redirecting to login');
    return <Navigate to="/auth" replace />;
  }
};