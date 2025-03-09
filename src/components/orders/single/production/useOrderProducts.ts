
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useOrderProducts = (orderId?: string | number) => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderProducts = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('order_products')
          .select('*')
          .eq('order_id', orderId);

        if (error) {
          throw error;
        }

        // For demo purposes, if no products are found in Supabase,
        // create some sample products
        if (!data || data.length === 0) {
          setProducts([
            {
              id: '1',
              order_id: orderId,
              name: 'Professional Photography',
              status: 'to_do',
              assigned_editor: 'John Editor'
            },
            {
              id: '2',
              order_id: orderId,
              name: 'Video Tour',
              status: 'in_production',
              assigned_editor: 'Sarah Editor'
            },
            {
              id: '3',
              order_id: orderId,
              name: 'Floor Plan',
              status: 'completed',
              assigned_editor: 'Mark Editor'
            }
          ]);
        } else {
          setProducts(data);
        }
      } catch (err: any) {
        console.error('Error fetching order products:', err);
        setError(err.message);
        toast.error(`Failed to load products: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderProducts();
  }, [orderId]);

  const updateProductStatus = async (productId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('order_products')
        .update({ status })
        .eq('id', productId);

      if (error) {
        throw error;
      }

      // Update the local state
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === productId ? { ...product, status } : product
        )
      );

      toast.success(`Product status updated to ${status}`);
    } catch (err: any) {
      console.error('Error updating product status:', err);
      toast.error(`Failed to update status: ${err.message}`);
    }
  };

  return { products, isLoading, error, updateProductStatus };
};
