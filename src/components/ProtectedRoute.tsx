
import { AuthRedirect } from "@/components/auth/AuthRedirect";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * A wrapper component that protects routes from unauthenticated access
 */
export default function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  // Pass the requireAuth prop to the AuthRedirect component
  return <AuthRedirect requireAuth={requireAuth}>{children}</AuthRedirect>;
}
