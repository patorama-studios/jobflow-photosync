
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  
  /**
   * Get user profile by ID
   */
  getProfile: async (userId: string) => {
    try {
      if (!userId) throw new Error('User ID is required');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
      }
      
      return data;
    } catch (error: any) {
      console.error('Error in getProfile:', error.message);
      return null;
    }
  },
  
  /**
   * Update user profile
   */
  updateProfile: async (userId: string, updates: { 
    full_name?: string; 
    username?: string; 
    phone?: string;
    avatar_url?: string;
  }) => {
    try {
      if (!userId) throw new Error('User ID is required');
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
        
      let result;
      
      if (existingProfile) {
        // Update existing profile
        result = await supabase
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
      } else {
        // Create new profile
        result = await supabase
          .from('profiles')
          .insert({
            id: userId,
            ...updates,
            updated_at: new Date().toISOString()
          });
      }
      
      if (result.error) {
        console.error('Error updating profile:', result.error);
        throw result.error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Error in updateProfile:', error.message);
      return false;
    }
  },
  
  /**
   * Get app settings
   */
  getAppSettings: async (key: string) => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('key', key)
        .maybeSingle();
        
      if (error) {
        console.error(`Error fetching ${key} settings:`, error);
        return null;
      }
      
      return data?.value;
    } catch (error: any) {
      console.error(`Error in getAppSettings(${key}):`, error.message);
      return null;
    }
  },
  
  /**
   * Save app settings
   */
  saveAppSettings: async (
    key: string, 
    value: any, 
    userId?: string, 
    isGlobal: boolean = false
  ) => {
    try {
      // Check if setting exists
      const { data: existingData } = await supabase
        .from('app_settings')
        .select('id')
        .eq('key', key)
        .maybeSingle();
        
      let result;
      
      if (existingData) {
        // Update existing setting
        result = await supabase
          .from('app_settings')
          .update({ 
            value,
            updated_at: new Date().toISOString() 
          })
          .eq('key', key);
      } else {
        // Create new setting
        result = await supabase
          .from('app_settings')
          .insert({
            key,
            value,
            user_id: userId,
            is_global: isGlobal,
          });
      }
      
      if (result.error) {
        console.error(`Error saving ${key} settings:`, result.error);
        return false;
      }
      
      return true;
    } catch (error: any) {
      console.error(`Error in saveAppSettings(${key}):`, error.message);
      return false;
    }
  }
};
