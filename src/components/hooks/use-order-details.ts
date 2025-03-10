
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOrderDetails } from '@/services/orders/order-fetch-service';
import { saveOrderChanges } from '@/services/orders/order-modify-service';
import { toast } from 'sonner';
import { Order, OrderStatus } from '@/types/order-types';

export function useOrderDetails(orderId: string) {
  const [localOrder, setLocalOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Fetch order details with react-query
  const {
    data: order,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { order, error } = await fetchOrderDetails(orderId);
      if (error) throw new Error(error);
      return order;
    },
    enabled: !!orderId
  });

  // Set the local order state whenever the fetched order changes
  useEffect(() => {
    if (order) {
      setLocalOrder(order);
    }
  }, [order]);

  // Function to handle order editing
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Function to handle cancelling edit mode
  const handleCancelClick = () => {
    // Reset the local order to the original order data
    if (order) {
      setLocalOrder(order);
    }
    setIsEditing(false);
  };

  // Function to update a field in the local order state
  const updateOrderField = (field: keyof Order, value: any) => {
    if (!localOrder) return;
    
    setLocalOrder(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  // Function to update multiple fields at once
  const updateOrderFields = (fields: Partial<Order>) => {
    if (!localOrder) return;
    
    setLocalOrder(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        ...fields
      };
    });
  };

  // Function to save changes
  const handleSaveClick = async () => {
    if (!localOrder) return;
    
    setIsSaving(true);
    
    try {
      const result = await saveOrderChanges(localOrder);
      
      if (result.success) {
        toast.success('Order details saved successfully');
        setIsEditing(false);
        refetch(); // Refresh order data from the server
      } else {
        toast.error(`Failed to save changes: ${result.error}`);
      }
    } catch (error: any) {
      toast.error(`Error saving changes: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Function to update order status
  const updateOrderStatus = (newStatus: OrderStatus) => {
    updateOrderField('status', newStatus);
  };

  return {
    order: localOrder,
    originalOrder: order,
    isLoading,
    error,
    isEditing,
    isSaving,
    activeTab,
    setActiveTab,
    handleEditClick,
    handleCancelClick,
    handleSaveClick,
    updateOrderField,
    updateOrderFields,
    updateOrderStatus,
    refetch
  };
}
