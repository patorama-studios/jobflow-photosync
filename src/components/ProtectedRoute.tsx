
import { AuthRedirect } from "@/components/auth/AuthRedirect";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * A wrapper component that protects routes from unauthenticated access
 */
export default function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  // Pass the requireAuth and redirectTo props to the AuthRedirect component
  return (
    <AuthRedirect 
      requireAuth={requireAuth} 
      redirectTo={redirectTo}
    >
      {children}
    </AuthRedirect>
  );
}
