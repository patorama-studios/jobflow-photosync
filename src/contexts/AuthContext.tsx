
import { createContext, useContext, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useProfile } from '@/hooks/useProfile';
import { useEmailVerification } from '@/hooks/useEmailVerification';
import { useSessionManagement } from '@/hooks/useSessionManagement';
import { useUserActivation } from '@/hooks/useUserActivation';
import type { AuthContextType } from '@/types/auth-types';

// Create a default context value with all required properties
const defaultContextValue: AuthContextType = {
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
  checkSession: async () => false,
  activateUser: async () => ({ success: false, error: null }),
  sendVerificationEmail: async () => ({ success: false, error: null }),
  verifyEmail: async () => ({ success: false, error: null }),
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Use the session management hook
  const { 
    session, 
    user, 
    isLoading, 
    setIsLoading,
    initialCheckDone,
    checkSession,
    signOut
  } = useSessionManagement();
  
  // Get the user ID safely
  const userId = user?.id;
  
  // Only call useProfile when we have a user ID
  const { profile, isLoading: profileLoading } = useProfile(userId);
  
  const { sendVerificationEmail, verifyEmail } = useEmailVerification();
  const { activateUser } = useUserActivation();
  
  // Initialize auth state on mount
  useEffect(() => {
    console.log('AuthContext initializing...');
    let authStateSubscription: { data: { subscription: { unsubscribe: () => void } } };
    
    // Immediately check session
    checkSession();
    
    // Set up auth state change listener
    const setupAuthListener = async () => {
      authStateSubscription = supabase.auth.onAuthStateChange((event, newSession) => {
        console.log('Auth state changed:', { event, hasSession: !!newSession });
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log('User signed in or token refreshed');
          
          toast.success('Authentication updated', {
            description: event === 'SIGNED_IN' ? 'You are now signed in' : 'Your session was refreshed'
          });
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          
          toast.info('Signed out', {
            description: 'You have been signed out'
          });
        }
      });
    };

    setupAuthListener();
    
    // Failsafe: Force loading state to complete after a short delay
    const timer = setTimeout(() => {
      if (isLoading && !initialCheckDone.current) {
        console.log('Auth loading timeout reached, forcing completion');
        setIsLoading(false);
        initialCheckDone.current = true;
      }
    }, 2000); // Reduced timeout for better UX
    
    return () => {
      console.log('Cleaning up auth subscription');
      clearTimeout(timer);
      if (authStateSubscription) {
        authStateSubscription.data.subscription.unsubscribe();
      }
    };
  }, [checkSession, isLoading, initialCheckDone, setIsLoading]);

  // Help debug auth state for troubleshooting
  useEffect(() => {
    console.log('Auth state updated:', { 
      hasSession: !!session, 
      hasUser: !!user,
      isLoading,
      profileLoading,
      hasProfile: !!profile,
      initialCheckDone: initialCheckDone.current
    });
  }, [session, user, profile, isLoading, profileLoading, initialCheckDone]);

  // Create a context value object - combine session loading with profile loading
  const contextValue: AuthContextType = { 
    session, 
    user, 
    profile, 
    isLoading: isLoading || profileLoading, // Consider auth loading only complete when profile is also loaded
    signOut,
    checkSession, 
    activateUser,
    sendVerificationEmail,
    verifyEmail
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
