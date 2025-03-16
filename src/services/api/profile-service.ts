
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for user profile operations
 */
export const profileService = {
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
  }
};
