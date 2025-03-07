
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/order-types';

interface UseOrderDetailsResult {
  order: Order | null | undefined;
  isLoading: boolean;
  error: string | null;
  // Add missing properties from OrderDetails.tsx errors
  editedOrder: Order | null;
  isEditing: boolean;
  isDeleteDialogOpen: boolean;
  refundsForOrder: any[];
  setRefundsForOrder: (refunds: any[]) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handleEditClick: () => void;
  handleCancelClick: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (status: string) => void;
  handleSaveClick: () => void;
  handleDeleteClick: () => void;
  confirmDelete: () => void;
}

export function useOrderDetails(orderId: string | number): UseOrderDetailsResult {
  const [order, setOrder] = useState<Order | null | undefined>(null);
  const [editedOrder, setEditedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [refundsForOrder, setRefundsForOrder] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('orders')
          .select('*');
        
        // Check if orderId is a UUID (36 chars with hyphens) or a simple number
        if (typeof orderId === 'string' && 
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderId)) {
          // It's a UUID
          query = query.eq('id', orderId);
        } else {
          // It's a number or another format, use order_number instead
          query = query.eq('order_number', String(orderId));
        }
        
        const { data, error } = await query.single();

        if (error) {
          console.error('Error fetching order details:', error);
          setError(error.message);
          setOrder(null);
        } else if (data) {
          const mappedOrder = mapSupabaseDataToOrder(data);
          setOrder(mappedOrder);
          setEditedOrder(mappedOrder);
        } else {
          setOrder(undefined); // Order not found
        }
      } catch (err: any) {
        console.error('Unexpected error fetching order details:', err);
        setError(err.message || 'An unexpected error occurred');
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Update the map function to use correct types
  const mapSupabaseDataToOrder = (data: any) => {
    if (!data) return null;
    
    return {
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
      status: data.status,
      notes: data.notes,
      internalNotes: data.internal_notes,
      customerNotes: data.customer_notes,
      photographerPayoutRate: data.photographer_payout_rate,
      stripePaymentId: data.stripe_payment_id,
      
      // Legacy property names for compatibility
      order_number: data.order_number,
      client_email: data.client_email,
      client_phone: data.client_phone,
      scheduled_date: data.scheduled_date,
      scheduled_time: data.scheduled_time,
      property_type: data.property_type,
      square_feet: data.square_feet,
      photographer_payout_rate: data.photographer_payout_rate,
      internal_notes: data.internal_notes,
      customer_notes: data.customer_notes,
      stripe_payment_id: data.stripe_payment_id
    };
  };

  // Add the missing handler functions
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedOrder(order);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editedOrder) return;
    
    const { name, value } = e.target;
    setEditedOrder({
      ...editedOrder,
      [name]: value,
    });
  };

  const handleStatusChange = (status: string) => {
    if (!editedOrder) return;
    
    setEditedOrder({
      ...editedOrder,
      status,
    });
  };

  const handleSaveClick = async () => {
    if (!editedOrder) return;
    
    try {
      // Here you'd normally update the order in the database
      console.log('Saving order:', editedOrder);
      setOrder(editedOrder);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error saving order:', err);
      setError(err.message || 'An unexpected error occurred while saving');
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Here you'd normally delete the order from the database
      console.log('Deleting order:', order);
      setIsDeleteDialogOpen(false);
      // Redirect or handle post-deletion logic
    } catch (err: any) {
      console.error('Error deleting order:', err);
      setError(err.message || 'An unexpected error occurred while deleting');
      setIsDeleteDialogOpen(false);
    }
  };

  return { 
    order, 
    isLoading, 
    error,
    editedOrder,
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
