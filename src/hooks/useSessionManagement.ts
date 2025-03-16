
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export const useSessionManagement = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialCheckDone = useRef(false);

  // Check current session status
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

  // Sign out the current user
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

  return {
    session,
    setSession,
    user,
    setUser,
    isLoading,
    setIsLoading,
    initialCheckDone,
    checkSession,
    signOut
  };
};
