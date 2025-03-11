
import { useState } from 'react';
import { toast } from 'sonner';
import { UseFormReturn } from 'react-hook-form';
import { createOrder } from '@/services/orders/order-modify-service';
import { SelectedProduct, CustomItem } from './use-scheduling-details';

interface UseAppointmentSubmissionProps {
  form: UseFormReturn<any>;
  selectedDateTime: Date;
  selectedTime: string;
  selectedDuration: number;
  selectedProducts: SelectedProduct[];
  customItems: CustomItem[];
  onClose: () => void;
  onAppointmentAdded?: (appointmentData: any) => Promise<boolean>;
}

export const useAppointmentSubmission = ({
  form,
  selectedDateTime,
  selectedTime,
  selectedDuration,
  selectedProducts,
  customItems,
  onClose,
  onAppointmentAdded
}: UseAppointmentSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      
      // Calculate total price (products + custom items)
      const productsTotal = selectedProducts.reduce((sum, product) => sum + product.price, 0);
      const customItemsTotal = customItems.reduce((sum, item) => sum + item.price, 0);
      const totalPrice = (data.price || 0) + productsTotal + customItemsTotal;
      
      // Prepare order data
      const orderData = {
        ...data,
        scheduledDate: selectedDateTime.toISOString(),
        scheduledTime: selectedTime,
        hours_on_site: selectedDuration / 60, // Convert minutes to hours
        price: totalPrice,
        status: 'scheduled',
        orderNumber: data.orderNumber || `ORD-${Date.now()}`,
        // Include other derived fields
        propertyAddress: data.address,
        customerName: data.client,
        contactEmail: data.clientEmail,
        contactNumber: data.clientPhone,
        propertyType: data.property_type,
        squareFeet: data.square_feet
      };
      
      // Create the order
      const result = await createOrder(orderData);
      
      if (result.success) {
        toast.success("Order created successfully");
        
        // Call the callback if provided
        if (onAppointmentAdded) {
          await onAppointmentAdded(result.data);
        }
        
        onClose();
      } else {
        toast.error(`Failed to create order: ${result.error}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    onSubmit
  };
};
