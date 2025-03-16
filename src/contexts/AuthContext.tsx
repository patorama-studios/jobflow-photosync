
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useProfile } from '@/hooks/useProfile';
import { useEmailVerification } from '@/hooks/useEmailVerification';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  activateUser: (email: string) => Promise<{ success: boolean; error: string | null }>;
  sendVerificationEmail: (email: string) => Promise<{ success: boolean; error: string | null }>;
  verifyEmail: (email: string, token: string, type: string) => Promise<{ success: boolean; error: string | null }>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
  checkSession: async () => false,
  activateUser: async () => ({ success: false, error: null }),
  sendVerificationEmail: async () => ({ success: false, error: null }),
  verifyEmail: async () => ({ success: false, error: null }),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialCheckDone = useRef(false);
  
  const profile = useProfile(user?.id);
  const { sendVerificationEmail, verifyEmail } = useEmailVerification();
  
  // Improved session checking function that can be called manually
  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      console.log('Checking current session...');
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
        toast.error('Error checking authentication', {
          description: error.message
        });
        return false;
      }
      
      const currentSession = data.session;
      
      if (currentSession) {
        console.log('User found in session:', currentSession.user?.id);
        setSession(currentSession);
        setUser(currentSession.user || null);
        setIsLoading(false);
        initialCheckDone.current = true;
        return true;
      } else {
        console.log('No active session found');
        setSession(null);
        setUser(null);
        setIsLoading(false);
        initialCheckDone.current = true;
        return false;
      }
    } catch (error: any) {
      console.error('Error checking auth session:', error);
      toast.error('Authentication error', {
        description: error.message || 'Failed to verify your session'
      });
      setIsLoading(false);
      initialCheckDone.current = true;
      return false;
    }
  }, []);

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
          setSession(newSession);
          setUser(newSession?.user || null);
          setIsLoading(false);
          initialCheckDone.current = true;
          
          toast.success('Authentication updated', {
            description: event === 'SIGNED_IN' ? 'You are now signed in' : 'Your session was refreshed'
          });
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setSession(null);
          setUser(null);
          setIsLoading(false);
          initialCheckDone.current = true;
          
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
  }, [checkSession]);

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Sign out failed', {
          description: error.message
        });
        return;
      }
      console.log('User signed out successfully');
      // onAuthStateChange will handle state updates
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error('Error signing out', {
        description: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const activateUser = async (email: string) => {
    try {
      // In development mode, return a success response without actual activation
      if (import.meta.env.DEV) {
        console.log('DEV MODE: Simulating user activation for:', email);
        return { success: true, error: null };
      }

      const { data, error } = await supabase.auth.admin.updateUserById(
        'user_id_placeholder',
        { email_confirm: true }
      );

      if (error) {
        console.error('Error activating user:', error.message);
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error activating user:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  };

  // Help debug auth state for troubleshooting
  useEffect(() => {
    console.log('Auth state updated:', { 
      hasSession: !!session, 
      hasUser: !!user,
      isLoading,
      initialCheckDone: initialCheckDone.current
    });
  }, [session, user, isLoading]);

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      isLoading, 
      signOut,
      checkSession, 
      activateUser,
      sendVerificationEmail,
      verifyEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
