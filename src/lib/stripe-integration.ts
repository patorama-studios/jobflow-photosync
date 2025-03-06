
// This is a utility file for interacting with Stripe
import { supabase } from '@/integrations/supabase/client';

// Define the interface for Stripe configurations
export interface StripeConfig {
  mode: 'test' | 'live';
  accountId?: string;
  publishableKey?: string;
  connected: boolean;
}

/**
 * Verifies Stripe API keys by making a request to the Stripe Connect edge function
 */
export const verifyStripeKeys = async (
  secretKey: string,
  mode: 'test' | 'live'
): Promise<{ success: boolean; accountId?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-connect', {
      body: {
        action: 'verify',
        secretKey,
        mode
      }
    });

    if (error) {
      console.error('Error verifying Stripe keys:', error);
      return { success: false };
    }

    return { 
      success: true, 
      accountId: data.accountId 
    };
  } catch (error) {
    console.error('Error calling Stripe Connect function:', error);
    return { success: false };
  }
};

/**
 * Gets the current Stripe configuration from Supabase
 */
export const getStripeConfig = async (): Promise<StripeConfig | null> => {
  try {
    // In a real implementation, this would query a proper table
    // For now, we'll use a custom RPC function
    const { data, error } = await supabase.rpc('get_stripe_config');
    
    if (error) {
      console.error('Error getting Stripe config:', error);
      return null;
    }

    // Parse the response data into our StripeConfig interface
    return data as StripeConfig;
  } catch (error) {
    console.error('Error getting Stripe config:', error);
    return null;
  }
};

/**
 * Disconnects the Stripe integration
 */
export const disconnectStripe = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('save_stripe_config', {
      is_connected: false,
      stripe_mode: null,
      account_id: null
    });
    
    if (error) {
      console.error('Error disconnecting Stripe:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error disconnecting Stripe:', error);
    return false;
  }
};
