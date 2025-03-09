
import { useState, useEffect } from 'react';
import { Order } from '@/types/order-types';
import { fetchOrderDetails } from '@/services/order-service';
import { toast } from 'sonner';

interface UseOrderLoadingProps {
  orderId?: string | number;
}

interface UseOrderLoadingResult {
  order: Order | null | undefined;
  setOrder: (order: Order | null) => void;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

export function useOrderLoading({ 
  orderId 
}: UseOrderLoadingProps): UseOrderLoadingResult {
  const [order, setOrder] = useState<Order | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadOrderDetails = async () => {
      if (!orderId) {
        if (isMounted) {
          setIsLoading(false);
          setError("No order ID provided");
        }
        return;
      }

      setIsLoading(true);
      setError(null);

      console.log("Loading order details for ID:", orderId);
      try {
        const { order: fetchedOrder, error: fetchError } = await fetchOrderDetails(orderId);
        
        if (!isMounted) return;
        
        if (fetchError) {
          console.error("Error loading order:", fetchError);
          setError(fetchError);
          setOrder(null);
          toast.error(`Error loading order: ${fetchError}`);
        } else if (!fetchedOrder) {
          console.error("Order not found:", orderId);
          setError("Order not found");
          setOrder(null);
          toast.error("Order not found");
        } else {
          console.log("Order details loaded successfully:", fetchedOrder);
          setOrder(fetchedOrder);
          toast.success("Order details loaded");
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Exception in loadOrderDetails:", err);
          setError(err.message || "An unexpected error occurred");
          setOrder(null);
          toast.error(err.message || "An unexpected error occurred");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrderDetails();

    return () => {
      isMounted = false;
    };
  }, [orderId]);

  return {
    order,
    setOrder,
    isLoading,
    error,
    setError
  };
}
