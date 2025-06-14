import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { toast } from 'sonner';
import { auth } from '@/integrations/mysql/mock-client';

interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
}

interface AuthSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

interface AuthContextType {
  session: AuthSession | null;
  user: User | null;
  profile: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, userData?: { firstName?: string; lastName?: string; fullName?: string }) => Promise<{ success: boolean; error?: string }>;
  activateUser: () => Promise<{ success: boolean; error: string | null }>;
  sendVerificationEmail: () => Promise<{ success: boolean; error: string | null }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; error: string | null }>;
}

const defaultContextValue: AuthContextType = {
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
  checkSession: async () => false,
  signIn: async () => ({ success: false, error: 'Not implemented' }),
  signUp: async () => ({ success: false, error: 'Not implemented' }),
  activateUser: async () => ({ success: false, error: null }),
  sendVerificationEmail: async () => ({ success: false, error: null }),
  verifyEmail: async () => ({ success: false, error: null }),
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialCheckDone = useRef(false);

  // Check if user is authenticated
  const checkSession = async (): Promise<boolean> => {
    try {
      console.log('🔧 MySQLAuth: Checking session...');
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        console.log('🔧 MySQLAuth: No token found, user not authenticated');
        setSession(null);
        setUser(null);
        setIsLoading(false);
        return false;
      }

      console.log('🔧 MySQLAuth: Token found, verifying...');
      const userData = await auth.getUser(token);
      
      if (userData) {
        console.log('🔧 MySQLAuth: User verified, setting session');
        const sessionData: AuthSession = {
          access_token: token,
          token_type: 'bearer',
          expires_in: 86400,
          user: userData
        };
        
        setSession(sessionData);
        setUser(userData);
        setIsLoading(false);
        return true;
      } else {
        console.log('🔧 MySQLAuth: Token invalid, clearing');
        // Token is invalid, clear it
        localStorage.removeItem('auth_token');
        setSession(null);
        setUser(null);
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('🔧 MySQLAuth: Error checking session:', error);
      localStorage.removeItem('auth_token');
      setSession(null);
      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  // Sign in user
  const signIn = async (email: string, password: string) => {
    try {
      const result = await auth.signInWithPassword(email, password);
      
      if (result.success && result.data) {
        const { session: newSession, user: newUser } = result.data;
        
        // Store token in localStorage
        localStorage.setItem('auth_token', newSession.access_token);
        
        setSession(newSession);
        setUser(newUser);
        
        toast.success('Signed in successfully');
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Sign in failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Sign in failed' };
    }
  };

  // Sign up user
  const signUp = async (email: string, password: string, userData?: { 
    firstName?: string; 
    lastName?: string; 
    fullName?: string 
  }) => {
    try {
      const result = await auth.signUp(email, password, userData || {});
      
      if (result.success && result.data) {
        const { session: newSession, user: newUser } = result.data;
        
        // Store token in localStorage
        localStorage.setItem('auth_token', newSession.access_token);
        
        setSession(newSession);
        setUser(newUser);
        
        toast.success('Account created successfully');
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Sign up failed' };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Sign up failed' };
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      localStorage.removeItem('auth_token');
      setSession(null);
      setUser(null);
      
      toast.info('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Placeholder functions for compatibility
  const activateUser = async () => {
    return { success: false, error: 'User activation not implemented for MySQL auth' };
  };

  const sendVerificationEmail = async () => {
    return { success: false, error: 'Email verification not implemented for MySQL auth' };
  };

  const verifyEmail = async (token: string) => {
    return { success: false, error: 'Email verification not implemented for MySQL auth' };
  };

  // Initialize auth state on mount
  useEffect(() => {
    if (!initialCheckDone.current) {
      console.log('🔧 MySQLAuthContext initializing...');
      checkSession().finally(() => {
        initialCheckDone.current = true;
      });
    }
  }, []);

  // Auto-refresh token (simplified for JWT)
  useEffect(() => {
    if (session) {
      // In a production app, you'd want to refresh the token before it expires
      // For now, we'll just check the session periodically
      const interval = setInterval(() => {
        checkSession();
      }, 30 * 60 * 1000); // Check every 30 minutes

      return () => clearInterval(interval);
    }
  }, [session]);

  const value: AuthContextType = {
    session,
    user,
    profile: user, // For compatibility, profile is the same as user
    isLoading,
    signOut,
    checkSession,
    signIn,
    signUp,
    activateUser,
    sendVerificationEmail,
    verifyEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};