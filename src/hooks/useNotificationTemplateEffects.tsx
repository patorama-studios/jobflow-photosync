
import { useEffect, useState } from 'react';
import { useNotificationTemplates } from '@/contexts/NotificationTemplateContext';
import { supabase } from '@/integrations/supabase/client';

export const useNotificationTemplateEffects = () => {
  const { loading, loadRetry, setLoadRetry } = useNotificationTemplates();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
    };
    
    checkAuth();
  }, []);

  // Retry loading if needed
  useEffect(() => {
    if (!isAuthenticated) return; // Don't retry if not authenticated
    
    const timer = setTimeout(() => {
      if (loading && loadRetry < 3) {
        setLoadRetry(prev => prev + 1);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [loading, loadRetry, setLoadRetry, isAuthenticated]);

  return { loading, isAuthenticated };
};
