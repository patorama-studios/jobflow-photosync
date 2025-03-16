
import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { debounce } from '@/utils/performance-optimizer';

export const useSessionManagement = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initialCheckDone = useRef(false);
  const checkInProgress = useRef(false);

  // Prevent duplicate session checks 
  const debouncedSetLoading = useCallback(
    debounce((value: boolean) => {
      setIsLoading(value);
    }, 100),
    []
  );

  // Check current session status
  const checkSession = useCallback(async (): Promise<boolean> => {
    // Prevent multiple simultaneous checks
    if (checkInProgress.current) {
      console.log('Session check already in progress, skipping');
      return !!session;
    }

    try {
      console.log('Checking current session...');
      checkInProgress.current = true;
      debouncedSetLoading(true);
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
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
        initialCheckDone.current = true;
        return true;
      } else {
        console.log('No active session found');
        setSession(null);
        setUser(null);
        initialCheckDone.current = true;
        return false;
      }
    } catch (error: any) {
      console.error('Error checking auth session:', error);
      toast.error('Authentication error', {
        description: error.message || 'Failed to verify your session'
      });
      return false;
    } finally {
      debouncedSetLoading(false);
      checkInProgress.current = false;
      initialCheckDone.current = true;
    }
  }, [session, debouncedSetLoading]);

  // Ensure loading state completes
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading && initialCheckDone.current) {
        console.log('Forcing loading state to complete');
        setIsLoading(false);
      }
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [isLoading]);

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
      setSession(null);
      setUser(null);
      toast.success('Signed out successfully');
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
