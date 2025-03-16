
import { supabase } from '@/integrations/supabase/client';

/**
 * Service for authentication operations
 */
export const authService = {
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
