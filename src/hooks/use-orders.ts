import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '../types/order-types';
import { generateSampleOrders } from '../utils/generate-sample-orders';
import { mapSupabaseOrdersToOrderType } from '../utils/map-supabase-orders';

export function useSampleOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // First try to fetch from Supabase
        const { data: supabaseOrders, error } = await supabase
          .from('orders')
          .select('*');

        if (error) {
          console.error('Error fetching from Supabase:', error);
          throw new Error(error.message);
        }

        if (supabaseOrders && supabaseOrders.length > 0) {
          // Map Supabase orders to our Order format
          const mappedOrders = mapSupabaseOrdersToOrderType(supabaseOrders);
          console.log('Fetched orders from Supabase:', mappedOrders);
          setOrders(mappedOrders);
        } else {
          // Fallback to sample data if no Supabase data
          console.warn('No orders found in Supabase, using fallback data');
          throw new Error('No orders found');
        }
      } catch (err) {
        console.error('Error in useSampleOrders:', err);
        // Use local data as fallback
        const sampleData = generateSampleOrders();
        setOrders(sampleData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, isLoading, error };
}

// Re-export the Order type for use in other files
export type { Order } from '../types/order-types';
