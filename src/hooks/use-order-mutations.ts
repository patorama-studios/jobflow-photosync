import { useState } from 'react';
import { Order } from '@/types/orders';
import { supabase } from '@/integrations/supabase/client';

export function useOrderMutations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update an existing order
  const updateOrder = async (id: string, orderData: Partial<Order>) => {
    try {
      setIsLoading(true);
      
      // Map the frontend property names to the database property names
      const dbOrderData: Partial<Order> = {
        ...orderData,
        customer_notes: orderData.customer_notes,
        internal_notes: orderData.internal_notes,
        order_number: orderData.order_number,
        photographer: orderData.photographer,
        photographer_payout_rate: orderData.photographer_payout_rate,
        price: orderData.price,
        property_type: orderData.property_type,
        scheduled_date: orderData.scheduled_date,
        scheduled_time: orderData.scheduled_time,
        square_feet: orderData.square_feet,
        status: orderData.status
      };
      
      // For now in this demo, we'll just simulate a successful update
      console.log('Updating order:', id, dbOrderData);
      
      // In a real implementation, you would update the order in the database
      // const { error } = await supabase
      //   .from('orders')
      //   .update(dbOrderData)
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // Process custom fields if provided
      // if (orderData.customFields) {
      //   // First, delete existing custom fields
      //   await supabase
      //     .from('custom_fields')
      //     .delete()
      //     .eq('order_id', id);
      //   
      //   // Then insert new custom fields
      //   const customFieldsArray = Object.entries(orderData.customFields).map(
      //     ([field_key, field_value]) => ({
      //       order_id: id,
      //       field_key,
      //       field_value: String(field_value)
      //     })
      //   );
      //   
      //   if (customFieldsArray.length > 0) {
      //     await supabase.from('custom_fields').insert(customFieldsArray);
      //   }
      // }
      
      return { success: true };
    } catch (error) {
      console.error('Error updating order:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new order
  const createOrder = async (orderData: Omit<Order, "id">) => {
    try {
      setIsLoading(true);
      
      // In a real implementation, you would insert the order into the database
      // const { data, error } = await supabase.from('orders').insert(orderData).select();
      // 
      // if (error) throw error;
      // 
      // const newOrder = data[0];
      // 
      // // Process custom fields if provided
      // if (orderData.customFields) {
      //   const customFieldsArray = Object.entries(orderData.customFields).map(
      //     ([field_key, field_value]) => ({
      //       order_id: newOrder.id,
      //       field_key,
      //       field_value: String(field_value)
      //     })
      //   );
      //   
      //   if (customFieldsArray.length > 0) {
      //     await supabase.from('custom_fields').insert(customFieldsArray);
      //   }
      // }
      
      // For now in this demo, we'll just simulate a successful creation
      console.log('Creating order:', orderData);
      
      return { 
        success: true, 
        orderId: 'new-order-id' 
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an order
  const deleteOrder = async (id: string) => {
    try {
      setIsLoading(true);
      
      // In a real implementation, you would delete the order from the database
      // const { error } = await supabase.from('orders').delete().eq('id', id);
      // 
      // if (error) throw error;
      
      // For now in this demo, we'll just simulate a successful deletion
      console.log('Deleting order:', id);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting order:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    updateOrder,
    createOrder,
    deleteOrder,
  };
}
