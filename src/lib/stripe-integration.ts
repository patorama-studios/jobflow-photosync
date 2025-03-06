
import { supabase } from "@/integrations/supabase/client";

export interface StripeConfig {
  publishableKey: string;
  mode: 'test' | 'live';
  webhookSecret?: string;
}

export const createStripeIntegration = () => {
  return {
    /**
     * Store Stripe configuration in the database
     */
    async saveConfig(config: StripeConfig): Promise<boolean> {
      try {
        // In a real app, you'd save this to a protected API endpoint
        // that stores the secret key securely on the server
        const { error } = await supabase
          .from('integrations')
          .upsert(
            { 
              id: 'stripe',
              name: 'Stripe',
              config: { 
                publishableKey: config.publishableKey,
                mode: config.mode,
                webhookSecret: config.webhookSecret
              },
              updated_at: new Date().toISOString()
            },
            { onConflict: 'id' }
          );
        
        if (error) throw error;
        return true;
      } catch (error) {
        console.error('Error saving Stripe config:', error);
        return false;
      }
    },
    
    /**
     * Get Stripe configuration from the database
     */
    async getConfig(): Promise<StripeConfig | null> {
      try {
        const { data, error } = await supabase
          .from('integrations')
          .select('config')
          .eq('id', 'stripe')
          .single();
        
        if (error) throw error;
        return data?.config as StripeConfig;
      } catch (error) {
        console.error('Error retrieving Stripe config:', error);
        return null;
      }
    },
    
    /**
     * Test Stripe connection
     */
    async testConnection(publishableKey: string): Promise<boolean> {
      try {
        // In a production app, this would make a request to a server endpoint
        // that tests the connection with the Stripe API using the secret key
        
        // This is a simple validation of the key format
        return publishableKey.startsWith('pk_test_') || 
               publishableKey.startsWith('pk_live_');
      } catch (error) {
        console.error('Error testing Stripe connection:', error);
        return false;
      }
    },
    
    /**
     * Get publishable key for client-side Stripe operations
     */
    async getPublishableKey(): Promise<string | null> {
      const config = await this.getConfig();
      return config?.publishableKey || null;
    }
  };
};
