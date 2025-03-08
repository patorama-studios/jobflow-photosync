
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '@/types/order-types';
import { ArrowLeft } from 'lucide-react';

interface OrderSinglePageHeaderProps {
  order: Order;
}

export const OrderSinglePageHeader: React.FC<OrderSinglePageHeaderProps> = ({ order }) => {
  const navigate = useNavigate();
  
  // Handle back navigation
  const handleBackClick = () => {
    navigate('/orders');
  };

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-gray-800">Order #{order.orderNumber || order.order_number}</h1>
      <p className="text-lg text-gray-600">{order.address}, {order.city}, {order.state} {order.zip}</p>
      <div className="flex items-center text-sm text-gray-500">
        <button 
          onClick={handleBackClick}
          className="flex items-center hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>All Orders</span>
        </button>
        <span className="mx-2">&gt;</span>
        <span>Order #{order.orderNumber || order.order_number}</span>
      </div>
    </div>
  );
};
