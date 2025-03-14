
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
  
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  updateProfile: async (userId: string, updates: { 
    full_name?: string; 
    username?: string; 
    phone?: string;
    avatar_url?: string;
  }) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) throw error;
    return true;
  }
};
