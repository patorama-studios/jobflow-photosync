
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileQuestion } from "lucide-react";

interface OrderNotFoundProps {
  orderId: string;
}

export const OrderNotFound: React.FC<OrderNotFoundProps> = ({ orderId }) => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-12 flex flex-col items-center justify-center">
      <div className="bg-muted/50 rounded-lg p-8 max-w-md w-full text-center">
        <FileQuestion className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find an order with ID: <span className="font-mono bg-muted px-1 rounded">{orderId}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button onClick={() => navigate('/orders')}>
            Return to Orders
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};
