
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/orders";
import { useToast } from "@/hooks/use-toast";

export function useOrderMutations() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Function to create a new order
  const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsSubmitting(true);
      
      // Extract additional appointments and custom fields
      const { additionalAppointments, customFields, ...mainOrderData } = orderData;
      
      // Insert the main order data
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert([mainOrderData])
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Insert additional appointments if any
      if (additionalAppointments && additionalAppointments.length > 0) {
        const appointmentsToInsert = additionalAppointments.map(app => ({
          order_id: newOrder.id,
          date: app.date,
          time: app.time,
          description: app.description
        }));
        
        const { error: appointmentsError } = await supabase
          .from('additional_appointments')
          .insert(appointmentsToInsert);
        
        if (appointmentsError) throw appointmentsError;
      }
      
      // Insert custom fields if any
      if (customFields) {
        const fieldsToInsert = Object.entries(customFields).map(([key, value]) => ({
          order_id: newOrder.id,
          field_key: key,
          field_value: value
        }));
        
        if (fieldsToInsert.length > 0) {
          const { error: fieldsError } = await supabase
            .from('custom_fields')
            .insert(fieldsToInsert);
          
          if (fieldsError) throw fieldsError;
        }
      }
      
      toast({
        title: "Order created",
        description: `Order ${newOrder.order_number} has been created successfully`,
      });
      
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error creating order",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to update an existing order
  const updateOrder = async (orderId: string, orderData: Partial<Order>) => {
    try {
      setIsSubmitting(true);
      
      // Extract additional appointments and custom fields
      const { additionalAppointments, customFields, ...mainOrderData } = orderData;
      
      // Update the main order data
      const { error: orderError } = await supabase
        .from('orders')
        .update(mainOrderData)
        .eq('id', orderId);
      
      if (orderError) throw orderError;
      
      // Update additional appointments if provided
      if (additionalAppointments) {
        // First, delete existing appointments
        const { error: deleteAppError } = await supabase
          .from('additional_appointments')
          .delete()
          .eq('order_id', orderId);
        
        if (deleteAppError) throw deleteAppError;
        
        // Then, insert new appointments
        if (additionalAppointments.length > 0) {
          const appointmentsToInsert = additionalAppointments.map(app => ({
            order_id: orderId,
            date: app.date,
            time: app.time,
            description: app.description
          }));
          
          const { error: appointmentsError } = await supabase
            .from('additional_appointments')
            .insert(appointmentsToInsert);
          
          if (appointmentsError) throw appointmentsError;
        }
      }
      
      // Update custom fields if provided
      if (customFields) {
        // First, delete existing custom fields
        const { error: deleteFieldsError } = await supabase
          .from('custom_fields')
          .delete()
          .eq('order_id', orderId);
        
        if (deleteFieldsError) throw deleteFieldsError;
        
        // Then, insert new custom fields
        const fieldsToInsert = Object.entries(customFields).map(([key, value]) => ({
          order_id: orderId,
          field_key: key,
          field_value: value
        }));
        
        if (fieldsToInsert.length > 0) {
          const { error: fieldsError } = await supabase
            .from('custom_fields')
            .insert(fieldsToInsert);
          
          if (fieldsError) throw fieldsError;
        }
      }
      
      toast({
        title: "Order updated",
        description: "Order has been updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error updating order",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to delete an order
  const deleteOrder = async (orderId: string) => {
    try {
      setIsSubmitting(true);
      
      // Delete the order (cascade will handle related records)
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);
      
      if (error) throw error;
      
      toast({
        title: "Order deleted",
        description: "Order has been deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Error deleting order",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createOrder,
    updateOrder,
    deleteOrder,
    isSubmitting
  };
}
