
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrderDetails } from './use-order-details';
import { toast } from 'sonner';
import { Order, OrderStatus } from '@/types/order-types';
import { validateStatus } from '@/utils/order-status-utils';

export function useOrderSinglePage() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [refundsForOrder, setRefundsForOrder] = useState<any[]>([]);
  
  // Default empty order for editing with proper OrderStatus type
  const emptyOrder: Order = {
    id: '',
    status: 'pending', // Using a valid OrderStatus instead of empty string
    orderNumber: '',
    address: '',
    propertyType: '',
    squareFeet: 0,
    client: '',
    price: 0,
    scheduledDate: '',
    scheduledTime: '',
    photographer: '',
  };
  
  const [editedOrder, setEditedOrder] = useState<Order>(emptyOrder);
  
  const { 
    order, 
    isLoading, 
    error, 
    refetch, 
    deleteOrder,
    isNewOrder,
    isEditing: orderIsEditing,
    handleEditClick: orderHandleEditClick,
    handleCancelClick: orderHandleCancelClick,
    handleSaveClick: orderHandleSaveClick,
    updateOrderField,
    updateOrderStatus
  } = useOrderDetails(orderId || '');
  
  // Sync editing state with the useOrderDetails hook
  useEffect(() => {
    setIsEditing(orderIsEditing);
  }, [orderIsEditing]);
  
  // Update editedOrder when order data changes
  useEffect(() => {
    if (order) {
      setEditedOrder(order);
    }
  }, [order]);
  
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    try {
      if (deleteOrder) {
        await deleteOrder();
        toast.success("Order deleted successfully");
        navigate('/orders');
      }
    } catch (error) {
      toast.error("Failed to delete order");
      console.error(error);
    }
  };
  
  const handleEditClick = () => {
    orderHandleEditClick();
  };
  
  const handleCancelClick = () => {
    orderHandleCancelClick();
  };
  
  const handleSaveClick = async () => {
    orderHandleSaveClick();
  };
  
  const handleBackClick = () => {
    navigate('/orders');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateOrderField(name as keyof Order, value);
  };
  
  const handleStatusChange = (status: OrderStatus) => {
    updateOrderStatus(status);
  };

  return {
    order,
    isLoading,
    error,
    refetch,
    orderId,
    editedOrder,
    refundsForOrder,
    setRefundsForOrder,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    activeTab,
    setActiveTab,
    isEditing,
    isNewOrder,
    handleDeleteClick,
    confirmDelete,
    handleEditClick,
    handleCancelClick,
    handleSaveClick,
    handleBackClick,
    handleInputChange,
    handleStatusChange,
    navigate,
  };
}
