
import { useEffect, useState } from 'react';
import { useNotificationTemplates } from '@/contexts/NotificationTemplateContext';
import { supabase } from '@/integrations/supabase/client';

export const useNotificationTemplateEffects = () => {
  const { loading, loadRetry, setLoadRetry } = useNotificationTemplates();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Auth error:", error);
          setIsAuthenticated(false);
          return;
        }
        // Set auth status based on user presence
        setIsAuthenticated(!!data.user);
      } catch (e) {
        console.error("Auth check failed:", e);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
    
    // Also set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Retry loading if needed - but don't retry indefinitely
  useEffect(() => {
    // Skip retry if auth status is still unknown
    if (isAuthenticated === null) return;
    
    // Don't retry if explicitly not authenticated
    if (isAuthenticated === false) return;
    
    const timer = setTimeout(() => {
      if (loading && loadRetry < 3) {
        console.log(`Retrying template load, attempt ${loadRetry + 1}`);
        setLoadRetry(prev => prev + 1);
      }
    }, 3000); // Shorter timeout (3s instead of 5s)
    
    return () => clearTimeout(timer);
  }, [loading, loadRetry, setLoadRetry, isAuthenticated]);

  return { loading, isAuthenticated };
};
