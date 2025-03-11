import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './use-appointment-form-state';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { OrderStatus } from '@/types/order-types';
import { useOrders } from '../use-orders';

interface CustomItem {
  id: string;
  name: string;
  price: number;
}

interface SubmissionProps {
  form: UseFormReturn<FormValues>;
  selectedDateTime: Date;
  selectedTime: string;
  selectedDuration: number;
  selectedProducts: any[];
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
}: SubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refetch } = useOrders();

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Use the appointment start date and selected time to create a proper datetime
      const appointmentDate = values.scheduledDate;
      const [hours, minutes] = values.scheduledTime.split(':').map(Number);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      // Calculate end time based on duration
      const appointmentEndDate = new Date(appointmentDate);
      appointmentEndDate.setMinutes(appointmentEndDate.getMinutes() + selectedDuration);
      
      // Prepare the order data
      const orderData = {
        customerName: values.customerName,
        client: values.client,
        client_email: values.clientEmail,
        client_phone: values.clientPhone,
        address: values.address,
        city: values.city,
        state: values.state,
        zip: values.zip,
        propertyAddress: values.address,
        property_type: values.propertyType,
        scheduled_date: appointmentDate.toISOString().split('T')[0],
        scheduled_time: values.scheduledTime,
        appointment_start: appointmentDate.toISOString(),
        appointment_end: appointmentEndDate.toISOString(),
        hours_on_site: selectedDuration / 60,
        status: values.status as OrderStatus,
        photographer: values.photographer?.name || '',
        photographer_payout_rate: values.photographer?.payout_rate || 0,
        price: values.price,
        square_feet: values.squareFeet || 0,
        products: selectedProducts.map(p => p.id),
        notes: values.notes,
        package: values.package,
        order_number: values.orderNumber,
        company_id: values.company_id,
        customItems: customItems,
      };
      
      // If onAppointmentAdded callback is provided, use it
      if (onAppointmentAdded) {
        const success = await onAppointmentAdded(orderData);
        if (success) {
          toast.success("Appointment added successfully");
          onClose();
        }
      } else {
        // Otherwise insert directly to Supabase
        // For database insertion, format the data according to the table schema
        const dbOrderData = {
          client: orderData.client,
          client_email: orderData.client_email,
          client_phone: orderData.client_phone,
          address: orderData.address,
          city: orderData.city,
          state: orderData.state,
          zip: orderData.zip,
          property_type: orderData.property_type,
          scheduled_date: orderData.scheduled_date,
          scheduled_time: orderData.scheduled_time,
          appointment_start: orderData.appointment_start,
          appointment_end: orderData.appointment_end,
          hours_on_site: orderData.hours_on_site,
          status: orderData.status,
          photographer: orderData.photographer,
          photographer_payout_rate: orderData.photographer_payout_rate,
          price: orderData.price,
          square_feet: orderData.square_feet,
          package: orderData.package,
          order_number: orderData.order_number,
          notes: orderData.notes,
          company_id: orderData.company_id,
        };
        
        const { data, error } = await supabase.from('orders').insert([dbOrderData]);
        
        if (error) {
          console.error('Error creating order:', error);
          toast.error(`Failed to create order: ${error.message}`);
        } else {
          toast.success("Order created successfully");
          refetch();
          onClose();
        }
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    onSubmit
  };
};
