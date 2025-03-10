
import { supabase } from '@/integrations/supabase/client';

/**
 * Base service functions for interacting with Supabase
 */

export const validateStatus = (status: string | null | undefined): string => {
  if (!status) return "pending";
  
  const validStatuses = [
    "scheduled", "completed", "pending", "canceled", "cancelled",
    "rescheduled", "in_progress", "editing", "review", "delivered", "unavailable"
  ];
  
  return validStatuses.includes(status) 
    ? status 
    : "pending";
};

export const supabaseService = {
  supabase,
};
