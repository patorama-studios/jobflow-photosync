
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoading } from "@/components/loading/PageLoading";
import { useEffect } from "react";

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function AuthRedirect({ children, redirectTo = "/login", requireAuth = true }: AuthRedirectProps) {
  const { session, user, isLoading, checkSession } = useAuth();
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

  // Force refresh session on mount to ensure we have latest auth state
  useEffect(() => {
    if (isLoading) {
      // Explicitly check session when component mounts
      checkSession();
    }
  }, [checkSession]);

  // If still loading, show loading component with a shorter timeout
  if (isLoading) {
    // Use a much shorter timeout to prevent getting stuck
    return <PageLoading message="Verifying authentication..." forceRefreshAfter={3} />;
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
