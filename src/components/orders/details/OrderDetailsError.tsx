
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { RefetchOptions, QueryObserverResult } from "@tanstack/react-query";
import { Order } from '@/types/order-types';

interface OrderDetailsErrorProps {
  error: string | null;
  onRetry?: (options?: RefetchOptions) => Promise<QueryObserverResult<Order, Error>>;
  isNewOrderPage?: boolean;
}

export const OrderDetailsError: React.FC<OrderDetailsErrorProps> = ({ 
  error, 
  onRetry, 
  isNewOrderPage = false 
}) => {
  const navigate = useNavigate();
  
  // If we're on the "new" order page but getting an error, it's probably because
  // we're trying to fetch an order with ID "new"
  if (isNewOrderPage && error?.includes('invalid input syntax for type uuid')) {
    // Render a different component or redirect to create order form
    return null; // This component will not render on the new order route
  }
  
  return (
    <div className="container py-12 flex flex-col items-center justify-center">
      <div className="bg-destructive/10 rounded-lg p-8 max-w-md w-full text-center">
        <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Error Loading Order</h2>
        <p className="text-muted-foreground mb-6">
          {error || "An unexpected error occurred while trying to load the order details."}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button onClick={() => onRetry ? onRetry() : window.location.reload()}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => navigate('/orders')}>
            Return to Orders
          </Button>
        </div>
        {error && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">Technical Details</summary>
            <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto max-h-32">
              {error}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};
