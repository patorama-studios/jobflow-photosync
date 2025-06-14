
import { auth } from '@/integrations/mysql/mock-client';

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
      
      const result = await auth.signUp(email, password, userData);
      
      if (!result.success) {
        console.error('Error registering user:', result.error);
        throw new Error(result.error);
      }
      
      return { success: true, data: result.data };
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
      
      const result = await auth.signInWithPassword(email, password);
      
      if (!result.success) {
        console.error('Error logging in user:', result.error);
        throw new Error(result.error);
      }
      
      return { success: true, data: result.data };
    } catch (error: any) {
      console.error('Error in loginUser:', error);
      return { success: false, error: error.message };
    }
  }
};
