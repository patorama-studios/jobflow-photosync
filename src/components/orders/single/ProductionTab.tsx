
import React from 'react';
import { Order } from '@/types/order-types';
import { ProductionStatusCard } from './production/ProductionStatusCard';
import { MediaGalleryCard } from './production/MediaGalleryCard';
import { useOrderProducts } from './production/useOrderProducts';

interface ProductionTabProps {
  order: Order;
}

export const ProductionTab: React.FC<ProductionTabProps> = ({ order }) => {
  // Fix: Convert order.id to string if it's a number
  const orderId = typeof order.id === 'number' ? order.id.toString() : order.id;
  
  // Use the custom hook to fetch products data
  const { products, uploadStatuses, isLoading } = useOrderProducts(orderId);
  
  return (
    <div className="space-y-6">
      <ProductionStatusCard 
        order={order}
        products={products}
        uploadStatuses={uploadStatuses}
        isLoading={isLoading}
      />
      
      <MediaGalleryCard />
    </div>
  );
};
