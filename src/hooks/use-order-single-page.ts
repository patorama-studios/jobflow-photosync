
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
  
  const orderDetailsResult = useOrderDetails(orderId || '');
  
  const { 
    order, 
    isLoading, 
    error, 
    refetch,
    deleteOrder
  } = orderDetailsResult;
  
  // Extract the additional properties safely with proper types
  const orderIsEditing = 'isEditing' in orderDetailsResult ? orderDetailsResult.isEditing : false;
  const isNewOrder = 'isNewOrder' in orderDetailsResult ? orderDetailsResult.isNewOrder : false;
  const handleEditClick = 'handleEditClick' in orderDetailsResult ? orderDetailsResult.handleEditClick : () => {};
  const handleCancelClick = 'handleCancelClick' in orderDetailsResult ? orderDetailsResult.handleCancelClick : () => {};
  const handleSaveClick = 'handleSaveClick' in orderDetailsResult ? orderDetailsResult.handleSaveClick : async () => {};
  const updateOrderField = 'updateOrderField' in orderDetailsResult ? orderDetailsResult.updateOrderField : (field: keyof Order, value: any) => {};
  const updateOrderStatus = 'updateOrderStatus' in orderDetailsResult ? orderDetailsResult.updateOrderStatus : (status: OrderStatus) => {};
  
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
