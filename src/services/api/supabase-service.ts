
import { supabase } from '@/integrations/supabase/client';
import { validateStatus } from './utils/validation-utils';
import { profileService } from './profile-service';
import { appSettingsService } from './app-settings-service';
import { authService } from './auth-service';

/**
 * Consolidated service for Supabase interactions
 */
export const supabaseService = {
  supabase,
  validateStatus,
  
  // Re-export profile methods
  getProfile: profileService.getProfile,
  updateProfile: profileService.updateProfile,
  
  // Re-export app settings methods
  getAppSettings: appSettingsService.getAppSettings,
  saveAppSettings: appSettingsService.saveAppSettings,
  
  // Re-export auth methods
  registerUser: authService.registerUser,
  loginUser: authService.loginUser
};

// Export the validation utility separately
export { validateStatus };
