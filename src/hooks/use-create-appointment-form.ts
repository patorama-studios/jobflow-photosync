
import { useState, useCallback } from 'react';
import { useAppointmentFormState } from './appointment/use-appointment-form-state';
import { useAppointmentSections } from './appointment/use-appointment-sections';
import { useSchedulingDetails } from './appointment/use-scheduling-details';
import { useAppointmentSubmission } from './appointment/use-appointment-submission';
import { Order } from '@/types/order-types';

export interface CustomItem {
  id: string;
  name: string;
  price: number;
}

export interface SelectedProduct {
  id: string;
  name: string;
  price: number;
}

interface UseCreateAppointmentFormProps {
  selectedDate: Date;
  initialTime?: string;
  existingOrderData?: any;
  onClose: () => void;
  onAppointmentAdded?: (appointmentData: any) => Promise<boolean>;
  defaultSections?: {
    scheduling?: boolean;
    address?: boolean;
    customer?: boolean;
    photographer?: boolean;
    product?: boolean;
    customItems?: boolean;
    notes?: boolean;
  };
}

export const useCreateAppointmentForm = ({ 
  selectedDate, 
  initialTime, 
  existingOrderData, 
  onClose, 
  onAppointmentAdded,
  defaultSections = {
    scheduling: true,
    address: false,
    customer: false,
    photographer: false,
    product: false,
    customItems: false,
    notes: false
  }
}: UseCreateAppointmentFormProps) => {
  // Get form state
  const { form } = useAppointmentFormState(selectedDate, initialTime, existingOrderData);
  
  // Get sections state
  const sectionState = useAppointmentSections(defaultSections);
  
  // Get scheduling details
  const schedulingDetails = useSchedulingDetails(selectedDate, initialTime);
  
  // Setup form submission
  const submission = useAppointmentSubmission({
    form,
    selectedDateTime: schedulingDetails.selectedDateTime,
    selectedTime: schedulingDetails.selectedTime,
    selectedDuration: schedulingDetails.selectedDuration,
    selectedProducts: schedulingDetails.selectedProducts,
    customItems: schedulingDetails.customItems,
    onClose,
    onAppointmentAdded
  });

  // Update form values when scheduling details change
  const handleDateChange = (date: Date) => {
    schedulingDetails.handleDateChange(date);
    form.setValue('scheduledDate', date);
  };

  const handleTimeChange = (time: string) => {
    schedulingDetails.handleTimeChange(time);
    form.setValue('scheduledTime', time);
  };

  const handleDurationChange = (duration: number) => {
    schedulingDetails.handleDurationChange(duration);
    form.setValue('hours_on_site', duration / 60); // Convert minutes to hours
  };

  const handleProductsChange = (products: SelectedProduct[]) => {
    schedulingDetails.handleProductsChange(products);
    // Convert to string IDs for the form
    form.setValue('products', products.map(p => p.id));
  };

  return {
    form,
    isLoading: submission.isSubmitting,
    isSubmitting: submission.isSubmitting,
    selectedDateTime: schedulingDetails.selectedDateTime,
    selectedTime: schedulingDetails.selectedTime,
    selectedDuration: schedulingDetails.selectedDuration,
    selectedNotification: schedulingDetails.selectedNotification,
    customItems: schedulingDetails.customItems,
    selectedProducts: schedulingDetails.selectedProducts,
    ...sectionState,
    handleDateChange,
    handleTimeChange,
    handleDurationChange,
    handleNotificationMethodChange: schedulingDetails.handleNotificationMethodChange,
    handleAddCustomItem: schedulingDetails.handleAddCustomItem,
    handleRemoveCustomItem: schedulingDetails.handleRemoveCustomItem,
    handleProductsChange,
    onSubmit: form.handleSubmit(submission.onSubmit)
  };
};
