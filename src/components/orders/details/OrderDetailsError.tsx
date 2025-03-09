
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface OrderDetailsErrorProps {
  error: string;
}

export const OrderDetailsError: React.FC<OrderDetailsErrorProps> = ({ error }) => {
  return (
    <div className="container py-8">
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Error Loading Order</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Link to="/orders">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Orders
          </Button>
        </Link>
      </div>
    </div>
  );
};
