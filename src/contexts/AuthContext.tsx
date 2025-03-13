
import { createContext, useContext, useEffect, useState } from 'react';
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

  useEffect(() => {
    console.log('AuthContext initializing...');
    let authStateSubscription: { data: { subscription: { unsubscribe: () => void } } };
    let initTimeoutId: number;
    
    const initializeAuth = async () => {
      try {
        console.log('Getting initial session...');
        const { data } = await supabase.auth.getSession();
        const currentSession = data.session;
        console.log('Session retrieved:', currentSession ? 'Yes' : 'No');
        
        if (currentSession) {
          console.log('User found in session:', currentSession.user?.id);
        }
        
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        // Set up auth state change listener
        authStateSubscription = supabase.auth.onAuthStateChange((event, newSession) => {
          console.log('Auth state changed:', { event, hasSession: !!newSession });
          setSession(newSession);
          setUser(newSession?.user || null);
          setIsLoading(false);
        });
        
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        // Add a short timeout to avoid race conditions with initial rendering 
        // This ensures we don't get stuck in loading state
        initTimeoutId = window.setTimeout(() => {
          console.log('Auth initialization complete, setting isLoading to false');
          setIsLoading(false);
        }, 1500);
      }
    };

    // Initialize auth and clean up subscription when component unmounts
    initializeAuth();
    
    return () => {
      console.log('Cleaning up auth subscription');
      if (authStateSubscription) {
        authStateSubscription.data.subscription.unsubscribe();
      }
      if (initTimeoutId) {
        window.clearTimeout(initTimeoutId);
      }
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      console.log('User signed out successfully');
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

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      isLoading, 
      signOut, 
      activateUser,
      sendVerificationEmail,
      verifyEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
