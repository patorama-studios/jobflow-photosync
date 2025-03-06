
import { supabase } from '@/integrations/supabase/client';

// Define the types for Stripe configuration
export interface StripeConfig {
  mode: 'test' | 'live';
  connected: boolean;
  apiKey?: string;
  secretKey?: string;
  webhookSecret?: string;
  lastSynced?: string;
}

// Check if Stripe is connected
export async function isStripeConnected(): Promise<boolean> {
  try {
    const config = await getStripeConfig();
    return config ? config.connected : false;
  } catch (error) {
    console.error('Error checking Stripe connection:', error);
    return false;
  }
}

// Get the current Stripe configuration
export async function getStripeConfig(): Promise<StripeConfig | null> {
  try {
    // For now, we'll fetch from local storage as a fallback method
    // In a real implementation, this would come from a secure backend
    const storedConfig = localStorage.getItem('stripe_config');
    
    if (storedConfig) {
      return JSON.parse(storedConfig);
    }
    
    // Default configuration if nothing is found
    return {
      mode: 'test',
      connected: false
    };
  } catch (error) {
    console.error('Error getting Stripe config:', error);
    return null;
  }
}

// Save Stripe configuration
export async function saveStripeConfig(config: StripeConfig): Promise<boolean> {
  try {
    // For now, we'll save to local storage as a temp solution
    // In a real implementation, this would be saved securely in the backend
    localStorage.setItem('stripe_config', JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving Stripe config:', error);
    return false;
  }
}

// Connect to Stripe with provided credentials
export async function connectStripe(
  apiKey: string,
  secretKey: string,
  mode: 'test' | 'live',
  webhookSecret?: string
): Promise<{ success: boolean; message: string }> {
  try {
    // In a real implementation, we would validate these keys against Stripe's API
    // For now, we'll just check if they look like Stripe keys
    
    if (!apiKey.startsWith(mode === 'test' ? 'pk_test_' : 'pk_live_')) {
      return { 
        success: false, 
        message: 'Invalid Stripe public key format. Test keys should start with pk_test_' 
      };
    }
    
    if (!secretKey.startsWith(mode === 'test' ? 'sk_test_' : 'sk_live_')) {
      return { 
        success: false, 
        message: 'Invalid Stripe secret key format. Test keys should start with sk_test_' 
      };
    }
    
    // Save the configuration
    await saveStripeConfig({
      mode,
      connected: true,
      apiKey,
      secretKey,
      webhookSecret,
      lastSynced: new Date().toISOString()
    });
    
    return { 
      success: true, 
      message: 'Successfully connected to Stripe' 
    };
  } catch (error) {
    console.error('Error connecting to Stripe:', error);
    return { 
      success: false, 
      message: 'Failed to connect to Stripe. Please try again.' 
    };
  }
}

// Disconnect from Stripe
export async function disconnectStripe(): Promise<boolean> {
  try {
    // Remove Stripe configuration
    localStorage.removeItem('stripe_config');
    return true;
  } catch (error) {
    console.error('Error disconnecting from Stripe:', error);
    return false;
  }
}
