
import { supabase } from '@/integrations/supabase/client';

export interface StripeConfig {
  mode: 'test' | 'live';
  account_id?: string;
  connected_at?: string;
}

export interface Integration {
  id: string;
  name: string;
  connected: boolean;
  config?: StripeConfig;
  updated_at?: string;
}

// Check if Stripe is connected
export const isStripeConnected = async (): Promise<boolean> => {
  try {
    // Since we don't have direct access to an 'integrations' table yet,
    // we'll simulate this check by using the Supabase function
    // This will be replaced once the table is created
    const { data, error } = await supabase.rpc('get_stripe_status');
    
    if (error) {
      console.error('Error checking Stripe connection:', error);
      return false;
    }
    
    return data?.connected || false;
  } catch (error) {
    console.error('Error checking Stripe connection:', error);
    return false;
  }
};

// Get Stripe configuration
export const getStripeConfig = async (): Promise<StripeConfig | null> => {
  try {
    // Since we don't have direct access to an 'integrations' table yet,
    // we'll simulate this by using a Supabase function
    // This will be replaced once the table is created
    const { data, error } = await supabase.rpc('get_stripe_config');
    
    if (error) {
      console.error('Error getting Stripe config:', error);
      return null;
    }
    
    return data as StripeConfig;
  } catch (error) {
    console.error('Error getting Stripe config:', error);
    return null;
  }
};

// Verify Stripe credentials using the Edge Function
export const verifyStripeCredentials = async (
  secretKey: string,
  mode: 'test' | 'live'
): Promise<{ success: boolean; accountId?: string; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-connect', {
      body: { action: 'verify', secretKey, mode },
    });

    if (error) {
      console.error('Error verifying Stripe credentials:', error);
      return { success: false, error: error.message };
    }

    return data;
  } catch (error) {
    console.error('Error verifying Stripe credentials:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
