
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { useAppointmentSubmission } from './appointment/use-appointment-submission';

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

interface DefaultSections {
  scheduling?: boolean;
  address?: boolean;
  customer?: boolean;
  photographer?: boolean;
  product?: boolean;
  customItems?: boolean;
  notes?: boolean;
}

const appointmentFormSchema = z.object({
  client: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email().optional(),
  clientPhone: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  property_type: z.string().optional(),
  square_feet: z.number().optional(),
  price: z.number().optional(),
  photographer: z.string().optional(),
  photographer_payout_rate: z.number().optional(),
  customer_notes: z.string().optional(),
  internal_notes: z.string().optional(),
  package: z.string().optional(),
  orderNumber: z.string().optional()
});

export const useCreateAppointmentForm = ({ 
  selectedDate, 
  initialTime,
  existingOrderData,
  onClose,
  onAppointmentAdded,
  defaultSections = {} as DefaultSections
}) => {
  // Form state
  const form = useForm({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      client: existingOrderData?.client || '',
      clientEmail: existingOrderData?.clientEmail || '',
      clientPhone: existingOrderData?.clientPhone || '',
      address: existingOrderData?.address || '',
      city: existingOrderData?.city || '',
      state: existingOrderData?.state || '',
      zip: existingOrderData?.zip || '',
      property_type: existingOrderData?.property_type || 'Residential',
      square_feet: existingOrderData?.square_feet || 0,
      price: existingOrderData?.price || 199,
      photographer: existingOrderData?.photographer || '',
      photographer_payout_rate: existingOrderData?.photographer_payout_rate || 0,
      customer_notes: existingOrderData?.customer_notes || '',
      internal_notes: existingOrderData?.internal_notes || '',
      package: existingOrderData?.package || '',
      orderNumber: existingOrderData?.orderNumber || `ORD-${Date.now()}`
    }
  });

  // Date and time state
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(selectedDate || new Date());
  const [selectedTime, setSelectedTime] = useState<string>(initialTime || '9:00 AM');
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedNotification, setSelectedNotification] = useState<string>('email');
  
  // Products and custom items state
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  
  // Default values for section open states
  const defaultOpen = {
    scheduling: true,
    address: false,
    customer: false,
    photographer: false,
    product: false,
    customItems: false,
    notes: false
  };
  
  // Section open/closed state
  const [schedulingOpen, setSchedulingOpen] = useState(defaultSections.scheduling ?? defaultOpen.scheduling);
  const [addressOpen, setAddressOpen] = useState(defaultSections.address ?? defaultOpen.address);
  const [customerOpen, setCustomerOpen] = useState(defaultSections.customer ?? defaultOpen.customer);
  const [photographerOpen, setPhotographerOpen] = useState(defaultSections.photographer ?? defaultOpen.photographer);
  const [productOpen, setProductOpen] = useState(defaultSections.product ?? defaultOpen.product);
  const [customItemsOpen, setCustomItemsOpen] = useState(defaultSections.customItems ?? defaultOpen.customItems);
  const [notesOpen, setNotesOpen] = useState(defaultSections.notes ?? defaultOpen.notes);
  
  // Use the appointment submission hook
  const { isSubmitting, onSubmit: submitAppointment } = useAppointmentSubmission({
    form,
    selectedDateTime,
    selectedTime,
    selectedDuration,
    selectedProducts,
    customItems,
    onClose,
    onAppointmentAdded
  });
  
  // Handler functions
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDateTime(date);
    }
  };
  
  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleDurationChange = (duration: number) => {
    setSelectedDuration(duration);
  };
  
  const handleNotificationMethodChange = (method: string) => {
    setSelectedNotification(method);
  };
  
  const handleAddCustomItem = (item: CustomItem) => {
    setCustomItems([...customItems, item]);
  };
  
  const handleRemoveCustomItem = (itemId: string) => {
    setCustomItems(customItems.filter(item => item.id !== itemId));
  };
  
  const handleProductsChange = (products: SelectedProduct[]) => {
    setSelectedProducts(products);
  };
  
  // Form submission handler
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await submitAppointment(data);
    } catch (error) {
      console.error('Error submitting appointment:', error);
    }
  });
  
  return {
    form,
    isSubmitting,
    selectedDateTime,
    selectedTime,
    selectedDuration,
    selectedNotification,
    customItems,
    selectedProducts,
    schedulingOpen,
    addressOpen,
    customerOpen,
    photographerOpen,
    productOpen,
    customItemsOpen,
    notesOpen,
    setSchedulingOpen,
    setAddressOpen,
    setCustomerOpen,
    setPhotographerOpen,
    setProductOpen,
    setCustomItemsOpen,
    setNotesOpen,
    handleDateChange,
    handleTimeChange,
    handleDurationChange,
    handleNotificationMethodChange,
    handleAddCustomItem,
    handleRemoveCustomItem,
    handleProductsChange,
    onSubmit
  };
};
