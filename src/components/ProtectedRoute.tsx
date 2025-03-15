
import { AuthRedirect } from "@/components/auth/AuthRedirect";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * A wrapper component that protects routes from unauthenticated access
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Use our enhanced AuthRedirect component
  return <AuthRedirect>{children}</AuthRedirect>;
}
