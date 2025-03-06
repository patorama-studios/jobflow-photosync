
import { useState, useEffect } from 'react';
import { Order, OrderStatus, RefundRecord } from '@/types/orders';
import { useOrders } from '@/hooks/use-orders';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

export function useOrderDetails(id: string | undefined) {
  const navigate = useNavigate();
  const { orders, isLoading, error } = useOrders();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [refundsForOrder, setRefundsForOrder] = useState<RefundRecord[]>([]);

  useEffect(() => {
    if (id && orders) {
      const foundOrder = orders.find((order) => order.id === id);
      setOrder(foundOrder || null);
      setEditedOrder(foundOrder ? { ...foundOrder } : null);
    }
  }, [id, orders]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    if (order) {
      setEditedOrder({ ...order });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedOrder((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleStatusChange = (status: OrderStatus) => {
    setEditedOrder((prev) => (prev ? { ...prev, status: status } : prev));
  };

  const handleSaveClick = () => {
    if (!editedOrder) return;

    // Simulate API update
    setTimeout(() => {
      // Update the order in the orders array
      const updatedOrder = { ...editedOrder };
      
      // Update local state
      setOrder(updatedOrder);
      setIsEditing(false);

      toast({
        title: "Order updated",
        description: "Your order has been updated successfully.",
      });
    }, 500);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (id) {
      // Simulate API delete
      setTimeout(() => {
        // Redirect to the orders list
        navigate('/orders');

        toast({
          title: "Order deleted",
          description: "Your order has been deleted successfully.",
        });
      }, 500);
    }
  };

  return {
    order,
    editedOrder,
    isLoading,
    error,
    isEditing,
    isDeleteDialogOpen,
    refundsForOrder,
    setRefundsForOrder,
    setIsDeleteDialogOpen,
    handleEditClick,
    handleCancelClick,
    handleInputChange,
    handleStatusChange,
    handleSaveClick,
    handleDeleteClick,
    confirmDelete
  };
}
