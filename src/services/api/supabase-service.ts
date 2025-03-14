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
      
      console.log('Fetching profile for user ID:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
      }
      
      console.log('Profile data:', data);
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
    role?: string;
  }) => {
    try {
      if (!userId) throw new Error('User ID is required');
      
      console.log('Updating profile for user ID:', userId, 'with data:', updates);
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
        
      let result;
      
      if (existingProfile) {
        // Update existing profile
        console.log('Updating existing profile');
        result = await supabase
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);
      } else {
        // Create new profile
        console.log('Creating new profile');
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
  },
  
  /**
   * Register a new user
   */
  registerUser: async (email: string, password: string, userData: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
  }) => {
    try {
      console.log('Registering new user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
          }
        }
      });
      
      if (error) {
        console.error('Error registering user:', error);
        throw error;
      }
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Error in registerUser:', error);
      return { success: false, error: error.message };
    }
  },
  
  /**
   * Login a user
   */
  loginUser: async (email: string, password: string) => {
    try {
      console.log('Logging in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Error logging in user:', error);
        throw error;
      }
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Error in loginUser:', error);
      return { success: false, error: error.message };
    }
  }
};
