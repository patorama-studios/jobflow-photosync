import { db } from '@/integrations/mysql/client';
import { auth } from '@/integrations/mysql/auth';
import { validateStatus } from './utils/validation-utils';
import { profileService } from './profile-service';
import { appSettingsService } from './app-settings-service';
import { authService } from './auth-service';

/**
 * Consolidated service for MySQL interactions
 */
export const mysqlService = {
  db,
  auth,
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

// Export db and auth for direct access
export { db, auth };