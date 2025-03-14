
import { useEffect } from 'react';
import { useNotificationTemplates } from '@/contexts/NotificationTemplateContext';

export const useNotificationTemplateEffects = () => {
  const { loading, loadRetry, setLoadRetry } = useNotificationTemplates();

  // Retry loading if needed
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading && loadRetry < 3) {
        setLoadRetry(prev => prev + 1);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [loading, loadRetry, setLoadRetry]);

  return { loading };
};
