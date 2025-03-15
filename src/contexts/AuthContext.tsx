
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';
import { useEmailVerification } from '@/hooks/useEmailVerification';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
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
  checkSession: async () => {},
  activateUser: async () => ({ success: false, error: null }),
  sendVerificationEmail: async () => ({ success: false, error: null }),
  verifyEmail: async () => ({ success: false, error: null }),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const profile = useProfile(user?.id);
  const { sendVerificationEmail, verifyEmail } = useEmailVerification();
  
  // Improved session checking function that can be called manually
  const checkSession = useCallback(async () => {
    try {
      console.log('Checking current session...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
        return;
      }
      
      const currentSession = data.session;
      
      if (currentSession) {
        console.log('User found in session:', currentSession.user?.id);
        setSession(currentSession);
        setUser(currentSession.user || null);
      } else {
        console.log('No active session found');
        setSession(null);
        setUser(null);
      }
      
      // Complete initialization
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking auth session:', error);
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    console.log('AuthContext initializing...');
    let authStateSubscription: { data: { subscription: { unsubscribe: () => void } } };
    
    // Immediately begin session retrieval
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
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setSession(null);
          setUser(null);
          setIsLoading(false);
        }
      });
    };

    setupAuthListener();
    
    // Failsafe: Force loading state to complete after a short delay
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log('Auth loading timeout reached, forcing completion');
        setIsLoading(false);
      }
    }, 1000); // Reduced timeout to prevent long waits
    
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
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      console.log('User signed out successfully');
      // onAuthStateChange will handle state updates
    } catch (error) {
      console.error('Error signing out:', error);
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
      isLoading 
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
