import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Order } from '@/types/order-types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
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
  order?: Order;
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel?: () => void;
}

export const useCreateAppointmentForm = ({ order, onSubmit, onCancel }: UseCreateAppointmentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { refetch } = useOrders();

  const form = useForm<FormValues>({
    resolver: order ? undefined : zodResolver(formSchema),
    defaultValues: order ? transformOrderToFormValues(order) : {
      customerName: "",
      propertyAddress: "",
      scheduledDate: new Date(),
      scheduledTime: "09:00",
      status: "scheduled",
      photographer: null,
      amount: 0,
      completedDate: undefined,
      products: [],
      notes: "",
      contactNumber: "",
      contactEmail: "",
      type: "",
      orderNumber: "",
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

  const onSubmitHandler = async (values: FormValues) => {
    setIsLoading(true);
    try {
      if (order) {
        // Update existing order
        const orderData = formValuesToOrderData(values);
        const { data, error } = await supabase
          .from('orders')
          .update(orderData)
          .eq('id', order.id)
          .select();

        if (error) {
          console.error('Error updating order:', error);
          toast.error(`Failed to update order: ${error.message}`);
        } else {
          toast.success('Order updated successfully!');
          refetch();
          router.push('/orders');
        }
      } else {
        // Create new order
        const orderData = formValuesToOrderData(values);
        const { data, error } = await supabase
          .from('orders')
          .insert([orderData])
          .select();

        if (error) {
          console.error('Error creating order:', error);
          toast.error(`Failed to create order: ${error.message}`);
        } else {
          toast.success('Order created successfully!');
          refetch();
          router.push('/orders');
        }
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast.error(`Unexpected error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onCancelHandler = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const formValuesToOrderData = (values: FormValues): Partial<Order> => {
    const appointmentStart = values.scheduledDate ? new Date(values.scheduledDate) : new Date();
    const [hours, minutes] = values.scheduledTime.split(':').map(Number);
    appointmentStart.setHours(hours, minutes, 0, 0);
  
    const appointmentEnd = new Date(appointmentStart);
    if (values.hours_on_site) {
      appointmentEnd.setHours(appointmentStart.getHours() + values.hours_on_site);
    } else {
      appointmentEnd.setHours(appointmentStart.getHours() + 1);
    }
  
    const orderData: any = {
      customerName: values.customerName,
      propertyAddress: values.propertyAddress,
      scheduled_date: values.scheduledDate.toISOString().split('T')[0],
      scheduled_time: values.scheduledTime,
      status: values.status,
      photographer: values.photographer?.name || "",
      photographer_payout_rate: values.photographer?.payout_rate || 0,
      amount: values.amount,
      completedDate: values.completedDate ? values.completedDate.toISOString() : null,
      products: values.products,
      notes: values.notes,
      contactNumber: values.contactNumber,
      contactEmail: values.contactEmail,
      type: values.type,
      order_number: values.orderNumber,
      client: values.client,
      clientEmail: values.clientEmail,
      clientPhone: values.clientPhone,
      address: values.address,
      city: values.city,
      state: values.state,
      zip: values.zip,
      price: values.price,
      propertyType: values.propertyType,
      square_feet: values.squareFeet,
      package: values.package,
      drivingTimeMin: values.drivingTimeMin,
      previousLocation: values.previousLocation,
      internal_notes: values.internalNotes,
      customer_notes: values.customerNotes,
      stripe_payment_id: values.stripePaymentId,
      mediaUploaded: values.mediaUploaded,
      appointment_start: appointmentStart.toISOString(),
      appointment_end: appointmentEnd.toISOString(),
      hours_on_site: values.hours_on_site,
      timezone: values.timezone,
      total_payout_amount: values.total_payout_amount,
      total_order_price: values.total_order_price,
      total_amount_paid: values.total_amount_paid,
      company_id: values.company_id,
      invoice_number: values.invoice_number,
    };
  
    return orderData;
  };

  const transformOrderToFormValues = (order: Order): FormValues => {
    const transformedAppointments = order.additionalAppointments?.map(appt => ({
      id: appt.id.toString(),
      order_id: order.id.toString(),
      date: appt.date ? new Date(appt.date) : new Date(),
      time: appt.time || "",
      description: appt.description || ""
    })) || [];
  
    const transformedMediaLinks = order.mediaLinks?.map(link => ({
      id: link.id.toString(),
      order_id: order.id.toString(),
      url: link.url || "",
      type: link.type || "",
      title: link.title || ""
    })) || [];
  
    return {
      customerName: order.customerName || "",
      propertyAddress: order.propertyAddress || "",
      scheduledDate: order.scheduled_date ? new Date(order.scheduled_date) : new Date(),
      scheduledTime: order.scheduled_time || "09:00",
      status: order.status,
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
      price: order.price,
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

  return {
    form,
    isLoading,
    onSubmit: onSubmitHandler,
    onCancel: onCancelHandler,
  };
};
