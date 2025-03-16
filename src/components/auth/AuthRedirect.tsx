
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoading } from "@/components/loading/PageLoading";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { debounce } from "@/utils/performance-optimizer";

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

export function AuthRedirect({ children, redirectTo = "/login", requireAuth = true }: AuthRedirectProps) {
  const { session, user, isLoading, checkSession } = useAuth();
  const location = useLocation();
  const sessionChecked = useRef(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [checkInProgress, setCheckInProgress] = useState(false);
  const [forceShowContent, setForceShowContent] = useState(false);

  // Add more detailed debug logging
  console.log("AuthRedirect:", {
    path: location.pathname,
    hasSession: !!session,
    hasUser: !!user,
    isLoading,
    requireAuth,
    sessionChecked: sessionChecked.current,
    initialCheckDone,
    checkInProgress,
    forceShowContent,
    timestamp: new Date().toISOString()
  });

  // Force refresh session on mount to ensure we have latest auth state
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!sessionChecked.current && !checkInProgress) {
        try {
          setCheckInProgress(true);
          // Explicitly check session when component mounts
          await checkSession();
          sessionChecked.current = true;
          console.log("Session checked", { hasSession: !!session, hasUser: !!user });
        } catch (error) {
          console.error("Error checking session:", error);
          toast.error("Authentication error", {
            description: "Failed to verify your login status. Please try again."
          });
        } finally {
          setInitialCheckDone(true);
          setCheckInProgress(false);
        }
      }
    };
    
    checkAuthStatus();

    // Force content to show after a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isLoading || !initialCheckDone) {
        console.log("Forcing content to show after timeout");
        setForceShowContent(true);
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [checkSession, session, user, isLoading]);

  // If still loading and initial check is not done, show loading component
  if (!forceShowContent && (isLoading || !initialCheckDone || checkInProgress)) {
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
