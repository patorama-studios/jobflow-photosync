import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/order-types';

interface UseOrderDetailsResult {
  order: Order | null | undefined;
  isLoading: boolean;
  error: string | null;
}

export function useOrderDetails(orderId: string | number): UseOrderDetailsResult {
  const [order, setOrder] = useState<Order | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) {
          console.error('Error fetching order details:', error);
          setError(error.message);
          setOrder(null);
        } else if (data) {
          const mappedOrder = mapSupabaseDataToOrder(data);
          setOrder(mappedOrder);
        } else {
          setOrder(undefined); // Order not found
        }
      } catch (err: any) {
        console.error('Unexpected error fetching order details:', err);
        setError(err.message || 'An unexpected error occurred');
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Update the map function to use correct types
  const mapSupabaseDataToOrder = (data: any) => {
    if (!data) return null;
    
    return {
      id: data.id,
      orderNumber: data.order_number,
      client: data.client,
      clientEmail: data.client_email,
      clientPhone: data.client_phone,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      scheduledDate: data.scheduled_date,
      scheduledTime: data.scheduled_time,
      photographer: data.photographer,
      propertyType: data.property_type,
      squareFeet: data.square_feet,
      price: data.price,
      status: data.status,
      notes: data.notes,
      internalNotes: data.internal_notes,
      customerNotes: data.customer_notes,
      photographerPayoutRate: data.photographer_payout_rate,
      stripePaymentId: data.stripe_payment_id,
      
      // Legacy property names for compatibility
      order_number: data.order_number,
      client_email: data.client_email,
      client_phone: data.client_phone,
      scheduled_date: data.scheduled_date,
      scheduled_time: data.scheduled_time,
      property_type: data.property_type,
      square_feet: data.square_feet,
      photographer_payout_rate: data.photographer_payout_rate,
      internal_notes: data.internal_notes,
      customer_notes: data.customer_notes,
      stripe_payment_id: data.stripe_payment_id
    };
  };

  return { order, isLoading, error };
}
