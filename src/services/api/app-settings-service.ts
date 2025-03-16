
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for application settings operations
 */
export const appSettingsService = {
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
