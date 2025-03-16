
import { supabase } from '@/integrations/supabase/client';

export const useUserActivation = () => {
  const activateUser = async (email: string) => {
    try {
      // In development mode, return a success response without actual activation
      if (import.meta.env.DEV) {
        console.log('DEV MODE: Simulating user activation for:', email);
        return { success: true, error: null };
      }

      const { data, error } = await supabase.auth.admin.updateUserById(
        'user_id_placeholder',
        { email_confirm: true }
      );

      if (error) {
        console.error('Error activating user:', error.message);
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error activating user:', error);
      return { success: false, error: error.message || 'Unknown error' };
    }
  };

  return { activateUser };
};
