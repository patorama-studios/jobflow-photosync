
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface OrderProduct {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  description: string | null;
  quantity: number;
  price: number;
  status: 'to_do' | 'in_production' | 'completed';
  assigned_editor: string | null;
  created_at: string;
  updated_at: string;
}

export const useOrderProducts = (orderId?: string | number) => {
  return useQuery({
    queryKey: ['orderProducts', orderId],
    queryFn: async (): Promise<OrderProduct[]> => {
      if (!orderId) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('order_products')
        .select('*')
        .eq('order_id', String(orderId));
        
      if (error) {
        console.error('Error fetching order products:', error);
        throw error;
      }
      
      // Cast the data to ensure it matches our OrderProduct type
      return (data || []) as OrderProduct[];
    },
    enabled: !!orderId,
  });
};
