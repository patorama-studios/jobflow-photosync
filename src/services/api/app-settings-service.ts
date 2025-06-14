
import { db } from '@/integrations/mysql/mock-client';

/**
 * Service for application settings operations
 */
export const appSettingsService = {
  /**
   * Get app settings
   */
  getAppSettings: async (key: string) => {
    try {
      const setting = await db.queryOne(
        'SELECT * FROM app_settings WHERE `key` = ?',
        [key]
      );
      
      if (!setting) {
        return null;
      }
      
      // Parse JSON value if it's a string
      try {
        return typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
      } catch {
        return setting.value;
      }
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
      const existingData = await db.queryOne(
        'SELECT id FROM app_settings WHERE `key` = ?',
        [key]
      );
      
      // Serialize value as JSON string
      const serializedValue = JSON.stringify(value);
      
      if (existingData) {
        // Update existing setting
        await db.update('app_settings', {
          value: serializedValue,
          updated_at: new Date()
        }, { key });
      } else {
        // Create new setting
        await db.insert('app_settings', {
          key,
          value: serializedValue,
          user_id: userId || null,
          is_global: isGlobal,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
      
      return true;
    } catch (error: any) {
      console.error(`Error in saveAppSettings(${key}):`, error.message);
      return false;
    }
  }
};
