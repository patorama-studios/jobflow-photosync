
import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus, RefundRecord } from '@/types/orders';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

export function useOrderDetails(id: string | undefined) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [refundsForOrder, setRefundsForOrder] = useState<RefundRecord[]>([]);

  // Fetch the order from Supabase
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching order details:', error);
          setError(error.message);
          return;
        }

        if (data) {
          // Map Supabase order to our Order format
          const mappedOrder: Order = {
            id: data.id,
            order_number: data.order_number,
            client: data.client,
            client_email: data.client_email,
            client_phone: data.client_phone || '',
            address: data.address,
            city: data.city || '',
            state: data.state || '',
            zip: data.zip || '',
            scheduled_date: data.scheduled_date,
            scheduled_time: data.scheduled_time,
            photographer: data.photographer || '',
            photographer_payout_rate: data.photographer_payout_rate,
            price: data.price,
            property_type: data.property_type,
            square_feet: data.square_feet,
            status: data.status as OrderStatus,
            notes: data.notes || '',
            internal_notes: data.internal_notes || '',
            customer_notes: data.customer_notes || '',
            package: data.package || '',
          };

          setOrder(mappedOrder);
          setEditedOrder({ ...mappedOrder });
          console.log("Fetched order details:", mappedOrder);
        } else {
          setError('Order not found');
        }
      } catch (err: any) {
        console.error('Error in useOrderDetails:', err);
        setError(err.message || 'Failed to fetch order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // Use useCallback for event handlers
  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancelClick = useCallback(() => {
    setIsEditing(false);
    if (order) {
      setEditedOrder({ ...order });
    }
  }, [order]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedOrder((prev) => (prev ? { ...prev, [name]: value } : prev));
  }, []);

  const handleStatusChange = useCallback((status: OrderStatus) => {
    setEditedOrder((prev) => (prev ? { ...prev, status: status } : prev));
  }, []);

  const handleSaveClick = useCallback(async () => {
    if (!editedOrder || !id) return;

    try {
      // Map our Order format back to Supabase format
      const supabaseOrder = {
        order_number: editedOrder.order_number,
        client: editedOrder.client,
        client_email: editedOrder.client_email,
        client_phone: editedOrder.client_phone,
        address: editedOrder.address,
        city: editedOrder.city,
        state: editedOrder.state,
        zip: editedOrder.zip,
        scheduled_date: editedOrder.scheduled_date,
        scheduled_time: editedOrder.scheduled_time,
        photographer: editedOrder.photographer,
        photographer_payout_rate: editedOrder.photographer_payout_rate,
        price: editedOrder.price,
        property_type: editedOrder.property_type,
        square_feet: editedOrder.square_feet,
        status: editedOrder.status,
        notes: editedOrder.notes,
        internal_notes: editedOrder.internal_notes,
        customer_notes: editedOrder.customer_notes,
        package: editedOrder.package,
      };

      const { error } = await supabase
        .from('orders')
        .update(supabaseOrder)
        .eq('id', id);

      if (error) {
        console.error('Error updating order:', error);
        toast({
          title: "Error updating order",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setOrder(editedOrder);
      setIsEditing(false);

      toast({
        title: "Order updated",
        description: "Your order has been updated successfully.",
      });
    } catch (err: any) {
      console.error('Error saving order:', err);
      toast({
        title: "Error updating order",
        description: err.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  }, [editedOrder, id, toast]);

  const handleDeleteClick = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting order:', error);
        toast({
          title: "Error deleting order",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Order deleted",
        description: "Your order has been deleted successfully.",
      });

      // Redirect to the orders list
      navigate('/orders');
    } catch (err: any) {
      console.error('Error deleting order:', err);
      toast({
        title: "Error deleting order",
        description: err.message || "An unknown error occurred",
        variant: "destructive",
      });
    }
  }, [id, navigate, toast]);

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
