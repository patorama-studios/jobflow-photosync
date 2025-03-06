
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
    // Set loading true when checking auth state
    setIsLoading(true);
    
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast({
          title: "Authentication Error",
          description: "Failed to initialize authentication. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed:", _event);
        setSession(session);
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred while signing out.",
        variant: "destructive",
      });
    }
  };

  const activateUser = async (email: string) => {
    try {
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
