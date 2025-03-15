
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function AuthRedirect({ children, redirectTo = "/login" }: AuthRedirectProps) {
  const { session, user, isLoading } = useAuth();
  const location = useLocation();

  // Don't redirect while still loading auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!session || !user) {
    console.log("No session or user, redirecting to login");
    // Store the attempted path so we can redirect back after login
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // User is authenticated, allow access
  return <>{children}</>;
}
