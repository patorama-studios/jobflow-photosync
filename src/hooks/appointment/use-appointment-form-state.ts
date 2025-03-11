
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Order, OrderStatus } from '@/types/order-types';

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
export const formSchema = z.object({
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

// Helper function to transform order data to form values
export const transformOrderToFormValues = (order: Order): FormValues => {
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

export const useAppointmentFormState = (
  selectedDate: Date,
  initialTime: string | undefined,
  existingOrderData: any | undefined
) => {
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

  return { form };
};
