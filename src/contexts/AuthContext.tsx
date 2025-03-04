
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Function to manually activate a user for development purposes
  const activateUser = async (email: string) => {
    try {
      // This endpoint is only accessible to service_role keys, so we're using a workaround
      // for development by updating the admin_metadata directly
      const { data, error } = await supabase.auth.admin.updateUserById(
        'user_id_placeholder', // This won't be used but is required by the function
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

  // Function to send a verification email using our custom edge function
  const sendVerificationEmail = async (email: string) => {
    try {
      const verificationLink = `${window.location.origin}/verify?email=${encodeURIComponent(email)}&type=signup`;
      
      const emailHtml = `
        <h1>Verify Your Email Address</h1>
        <p>Thank you for signing up with Patorama Studios!</p>
        <p>Please click the button below to verify your email address:</p>
        <a href="${verificationLink}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Verify Email</a>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p>${verificationLink}</p>
        <p>If you didn't sign up for Patorama Studios, you can safely ignore this email.</p>
      `;
      
      const response = await supabase.functions.invoke('send-email', {
        body: {
          to: email,
          subject: 'Verify Your Email - Patorama Studios',
          html: emailHtml,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to send verification email');
      }

      toast({
        title: "Verification email sent",
        description: "Please check your inbox for the verification link",
      });

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      toast({
        title: "Failed to send verification email",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
      return { success: false, error: error.message || 'Unknown error' };
    }
  };

  // Function to verify an email using our custom edge function
  const verifyEmail = async (email: string, token: string, type: string) => {
    try {
      const response = await supabase.functions.invoke('verify-email', {
        body: { email, token, type },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to verify email');
      }

      toast({
        title: "Email verified successfully",
        description: "You can now sign in to your account",
      });

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error verifying email:', error);
      toast({
        title: "Failed to verify email",
        description: error.message || 'An unexpected error occurred',
        variant: "destructive",
      });
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
