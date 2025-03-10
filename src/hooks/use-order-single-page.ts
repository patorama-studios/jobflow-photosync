
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrderDetails } from './use-order-details';
import { Order } from '@/types/order-types';
import { toast } from 'sonner';
import { saveOrderChanges } from '@/services/order-service';

export function useOrderSinglePage() {
  const { orderId = '' } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [refundsForOrder, setRefundsForOrder] = useState<any[]>([]);
  
  const { 
    order: originalOrder, 
    isLoading, 
    error,
    refetch,
    deleteOrder 
  } = useOrderDetails(orderId);
  
  // Initialize edited order when original order loads
  useEffect(() => {
    if (originalOrder) {
      setEditedOrder(originalOrder);
    }
  }, [originalOrder]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (editedOrder) {
      setEditedOrder({
        ...editedOrder,
        [name]: value
      });
    }
  };
  
  const handleStatusChange = (status: string) => {
    if (editedOrder) {
      setEditedOrder({
        ...editedOrder,
        status: status as any
      });
    }
  };
  
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    try {
      deleteOrder();
      toast.success("Order deleted successfully");
      navigate('/orders');
    } catch (error) {
      toast.error("Failed to delete order");
      console.error(error);
    }
  };
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCancelClick = () => {
    // Reset changes
    setEditedOrder(originalOrder);
    setIsEditing(false);
  };
  
  const handleSaveClick = async () => {
    try {
      if (editedOrder) {
        await saveOrderChanges(orderId, editedOrder);
        toast.success("Order updated successfully");
        refetch(); // Refresh the data
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to update order");
      console.error(error);
    }
  };
  
  const handleBackClick = () => {
    navigate('/orders');
  };

  return {
    order: originalOrder,
    isLoading,
    error,
    refetch,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    activeTab,
    setActiveTab,
    isEditing,
    orderId,
    editedOrder,
    refundsForOrder,
    setRefundsForOrder,
    handleDeleteClick,
    confirmDelete,
    handleEditClick,
    handleCancelClick,
    handleSaveClick,
    handleBackClick,
    handleInputChange,
    handleStatusChange,
    navigate
  };
}
