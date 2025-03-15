
import { AuthRedirect } from "@/components/auth/AuthRedirect";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * A wrapper component that protects routes from unauthenticated access
 */
export default function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  // Use our enhanced AuthRedirect component
  return <AuthRedirect>{children}</AuthRedirect>;
}
