import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Order, OrderStatus } from '@/types/order-types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useOrders } from './use-orders';

// Define the schema for Additional Appointment
const additionalAppointmentSchema = z.object({
  id: z.string().optional(),
  order_id: z.string().optional(),
  date: z.date(),
  time: z.string(),
  description: z.string().optional(),
});

// Define the schema for Media Link
const mediaLinkSchema = z.object({
  id: z.string().optional(),
  order_id: z.string().optional(),
  url: z.string().url({ message: "Invalid URL" }),
  type: z.string().optional(),
  title: z.string().optional(),
});

// Define the core schema for the form
const formSchema = z.object({
  customerName: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  propertyAddress: z.string().min(5, {
    message: "Property address must be at least 5 characters.",
  }),
  scheduledDate: z.date(),
  scheduledTime: z.string().min(5, {
    message: "Scheduled time must be in HH:MM format.",
  }),
  status: z.string(),
  photographer: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email().optional(),
    payout_rate: z.number().optional(),
  }).nullable(),
  amount: z.number().optional(),
  completedDate: z.date().optional(),
  products: z.array(z.string()).optional(),
  notes: z.string().optional(),
  contactNumber: z.string().optional(),
  contactEmail: z.string().email().optional(),
  type: z.string().optional(),
  orderNumber: z.string().min(5, {
    message: "Order number must be at least 5 characters.",
  }),
  client: z.string().min(2, {
    message: "Client name must be at least 2 characters.",
  }),
  clientEmail: z.string().email({
    message: "Invalid email address.",
  }).optional(),
  clientPhone: z.string().optional(),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  price: z.number(),
  propertyType: z.string().optional(),
  squareFeet: z.number().optional(),
  package: z.string().optional(),
  drivingTimeMin: z.number().optional(),
  previousLocation: z.string().optional(),
  photographerPayoutRate: z.number().optional(),
  internalNotes: z.string().optional(),
  customerNotes: z.string().optional(),
  stripePaymentId: z.string().optional(),
  additionalAppointments: z.array(additionalAppointmentSchema).optional(),
  mediaLinks: z.array(mediaLinkSchema).optional(),
  mediaUploaded: z.boolean().optional(),
  appointment_start: z.string().optional(),
  appointment_end: z.string().optional(),
  hours_on_site: z.number().optional(),
  timezone: z.string().optional(),
  total_payout_amount: z.number().optional(),
  total_order_price: z.number().optional(),
  total_amount_paid: z.number().optional(),
  company_id: z.string().optional(),
  invoice_number: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

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

// Helper function to transform order data to form values
const transformOrderToFormValues = (order: Order): FormValues => {
  const transformedAppointments = order.additionalAppointments?.map(appt => ({
    id: appt.id ? appt.id.toString() : undefined,
    order_id: order.id ? order.id.toString() : undefined,
    date: appt.date ? new Date(appt.date) : new Date(),
    time: appt.time || "",
    description: appt.description || ""
  })) || [];

  const transformedMediaLinks = order.mediaLinks?.map(link => ({
    id: link.id ? link.id.toString() : undefined,
    order_id: order.id ? order.id.toString() : undefined,
    url: link.url || "",
    type: link.type || "",
    title: link.title || ""
  })) || [];

  return {
    customerName: order.customerName || "",
    propertyAddress: order.propertyAddress || "",
    scheduledDate: order.scheduled_date ? new Date(order.scheduled_date) : new Date(),
    scheduledTime: order.scheduled_time || "09:00",
    status: order.status || "",
    photographer: {
      id: order.photographer || "",
      name: order.photographer || "",
      email: order.client_email || "",
      payout_rate: order.photographerPayoutRate || 0,
    },
    amount: order.amount || 0,
    completedDate: order.completedDate ? new Date(order.completedDate) : undefined,
    products: order.products || [],
    notes: order.notes || "",
    contactNumber: order.contactNumber || "",
    contactEmail: order.contactEmail || "",
    type: order.type || "",
    orderNumber: order.order_number || "",
    client: order.client || "",
    clientEmail: order.client_email || "",
    clientPhone: order.client_phone || "",
    address: order.address || "",
    city: order.city || "",
    state: order.state || "",
    zip: order.zip || "",
    price: order.price || 0,
    propertyType: order.property_type || "",
    squareFeet: order.square_feet || 0,
    package: order.package || "",
    drivingTimeMin: order.drivingTimeMin || 0,
    previousLocation: order.previousLocation || "",
    photographerPayoutRate: order.photographerPayoutRate || 0,
    internalNotes: order.internalNotes || "",
    customerNotes: order.customerNotes || "",
    stripePaymentId: order.stripePaymentId || "",
    additionalAppointments: transformedAppointments,
    mediaLinks: transformedMediaLinks,
    mediaUploaded: order.mediaUploaded || false,
    appointment_start: order.appointment_start || "",
    appointment_end: order.appointment_end || "",
    hours_on_site: order.hours_on_site || 0,
    timezone: order.timezone || "",
    total_payout_amount: order.total_payout_amount || 0,
    total_order_price: order.total_order_price || 0,
    total_amount_paid: order.total_amount_paid || 0,
    company_id: order.company_id || "",
    invoice_number: order.invoice_number || "",
  };
};

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date>(selectedDate);
  const [selectedTime, setSelectedTime] = useState(initialTime || "09:00");
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [selectedNotification, setSelectedNotification] = useState("email");
  const [customItems, setCustomItems] = useState<{ name: string; price: number }[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Sections open/closed state
  const [schedulingOpen, setSchedulingOpen] = useState(defaultSections.scheduling !== false);
  const [addressOpen, setAddressOpen] = useState(defaultSections.address === true);
  const [customerOpen, setCustomerOpen] = useState(defaultSections.customer === true);
  const [photographerOpen, setPhotographerOpen] = useState(defaultSections.photographer === true);
  const [productOpen, setProductOpen] = useState(defaultSections.product === true);
  const [customItemsOpen, setCustomItemsOpen] = useState(defaultSections.customItems === true);
  const [notesOpen, setNotesOpen] = useState(defaultSections.notes === true);
  
  const { refetch } = useOrders();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: existingOrderData ? transformOrderToFormValues(existingOrderData) : {
      customerName: "",
      propertyAddress: "",
      scheduledDate: selectedDate,
      scheduledTime: initialTime || "09:00",
      status: "scheduled" as OrderStatus,
      photographer: null,
      amount: 0,
      completedDate: undefined,
      products: [],
      notes: "",
      contactNumber: "",
      contactEmail: "",
      type: "",
      orderNumber: `ORD-${Date.now()}`,
      client: "",
      clientEmail: "",
      clientPhone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      price: 0,
      propertyType: "",
      squareFeet: 0,
      package: "",
      drivingTimeMin: 0,
      previousLocation: "",
      photographerPayoutRate: 0,
      internalNotes: "",
      customerNotes: "",
      stripePaymentId: "",
      additionalAppointments: [],
      mediaLinks: [],
      mediaUploaded: false,
      appointment_start: "",
      appointment_end: "",
      hours_on_site: 0,
      timezone: "",
      total_payout_amount: 0,
      total_order_price: 0,
      total_amount_paid: 0,
      company_id: "",
      invoice_number: "",
    },
    mode: "onChange"
  });

  const handleDateChange = (date: Date) => {
    setSelectedDateTime(date);
    form.setValue('scheduledDate', date);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    form.setValue('scheduledTime', time);
  };

  const handleDurationChange = (duration: number) => {
    setSelectedDuration(duration);
    form.setValue('hours_on_site', duration / 60); // Convert minutes to hours
  };

  const handleNotificationMethodChange = (method: string) => {
    setSelectedNotification(method);
  };

  const handleAddCustomItem = (item: { name: string; price: number }) => {
    setCustomItems([...customItems, item]);
  };

  const handleRemoveCustomItem = (index: number) => {
    const updatedItems = [...customItems];
    updatedItems.splice(index, 1);
    setCustomItems(updatedItems);
  };

  const handleProductsChange = (products: string[]) => {
    setSelectedProducts(products);
    form.setValue('products', products);
  };

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
        products: selectedProducts,
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
    form,
    isLoading: isSubmitting,
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
