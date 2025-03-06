
import { useState, useEffect } from 'react';
import { Order } from '@/types/order-types';
import { supabase } from '@/integrations/supabase/client';

export const useOrderDetails = (orderId: string | undefined) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [refundsForOrder, setRefundsForOrder] = useState<any[]>([]);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (error) throw error;

        if (data) {
          // Convert the database record to an Order type with both new and legacy properties
          const orderData: Order = {
            id: data.id,
            orderNumber: data.order_number,
            client: data.client,
            clientEmail: data.client_email,
            clientPhone: data.client_phone,
            address: data.address,
            city: data.city,
            state: data.state,
            zip: data.zip,
            scheduledDate: data.scheduled_date,
            scheduledTime: data.scheduled_time,
            photographer: data.photographer,
            propertyType: data.property_type,
            squareFeet: data.square_feet,
            price: data.price,
            status: data.status as any,
            photographerPayoutRate: data.photographer_payout_rate,
            notes: data.notes,
            package: data.package,
            stripePaymentId: data.stripe_payment_id,
            
            // Also set legacy properties for backward compatibility
            order_number: data.order_number,
            scheduled_date: data.scheduled_date,
            scheduled_time: data.scheduled_time,
            client_email: data.client_email,
            client_phone: data.client_phone,
            property_type: data.property_type,
            square_feet: data.square_feet,
            photographer_payout_rate: data.photographer_payout_rate,
            customer_notes: data.customer_notes,
            internal_notes: data.internal_notes,
            stripe_payment_id: data.stripe_payment_id
          };

          setOrder(orderData);
          setEditedOrder(orderData);
        } else {
          setError('Order not found');
        }
      } catch (err: any) {
        console.error('Error fetching order details:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleEditClick = () => setIsEditing(true);
  const handleCancelClick = () => {
    setEditedOrder(order);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editedOrder) return;
    
    const { name, value } = e.target;
    setEditedOrder(prev => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  const handleStatusChange = (value: string) => {
    if (!editedOrder) return;
    
    setEditedOrder(prev => {
      if (!prev) return prev;
      return { ...prev, status: value };
    });
  };

  const handleSaveClick = async () => {
    // Implement save functionality
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    // Implement delete functionality
    setIsDeleteDialogOpen(false);
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
};
