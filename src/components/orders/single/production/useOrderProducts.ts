
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOrderProducts = (orderId: string) => {
  // Fetch order products from the database
  const { data: orderProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['orderProducts', orderId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('order_products')
          .select('*')
          .eq('order_id', orderId);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching order products:', error);
        return [];
      }
    },
    enabled: !!orderId
  });
  
  // Mock data for upload statuses since we don't have the real table yet
  const mockUploadStatuses = [
    { id: 1, order_id: orderId, product_id: 1, status: 'in_progress', total_uploaded: 23, total_required: 30 },
    { id: 2, order_id: orderId, product_id: 2, status: 'completed', total_uploaded: 1, total_required: 1 },
    { id: 3, order_id: orderId, product_id: 3, status: 'not_started', total_uploaded: 0, total_required: 1 },
    { id: 4, order_id: orderId, product_id: 4, status: 'error', total_uploaded: 2, total_required: 5 }
  ];
  
  // Use fetched products or fallback to mock data
  const products = orderProducts?.length ? orderProducts : [
    { id: 1, name: 'Professional Photography', status: 'to_do', assigned_editor: null },
    { id: 2, name: 'Virtual Tour', status: 'in_production', assigned_editor: 'David Chen' },
    { id: 3, name: 'Floor Plan', status: 'completed', assigned_editor: 'Sarah Miller' },
    { id: 4, name: 'Video Tour', status: 'in_production', assigned_editor: 'James Wilson' }
  ];

  return {
    products,
    uploadStatuses: mockUploadStatuses,
    isLoading: productsLoading
  };
};
