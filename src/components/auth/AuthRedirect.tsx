
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoading } from "@/components/loading/PageLoading";

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function AuthRedirect({ children, redirectTo = "/login", requireAuth = true }: AuthRedirectProps) {
  const { session, user, isLoading } = useAuth();
  const location = useLocation();

  // Add more detailed debug logging
  console.log("AuthRedirect:", {
    path: location.pathname,
    hasSession: !!session,
    hasUser: !!user,
    isLoading,
    requireAuth,
    timestamp: new Date().toISOString()
  });

  // Show custom loading component while auth is initializing, but with shorter timeout
  if (isLoading) {
    return <PageLoading message="Verifying authentication..." forceRefreshAfter={5} />;
  }

  // If authentication is required and user is not authenticated, redirect to login
  if (requireAuth && (!session || !user)) {
    console.log("No session or user, redirecting to login from:", location.pathname);
    // Store the attempted path so we can redirect back after login
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // User is authenticated or auth not required, allow access
  console.log("Access allowed to:", location.pathname);
  return <>{children}</>;
}
