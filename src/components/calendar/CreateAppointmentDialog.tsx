
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { SuggestedDates } from './appointment/components/SuggestedDates';
import { DateTimeSelector } from './appointment/components/DateTimeSelector';
import { DurationSelector } from './appointment/components/DurationSelector';
import { NotificationSelector } from './appointment/components/NotificationSelector';
import { supabase } from '@/integrations/supabase/client';

// Define the schema for our form
const formSchema = z.object({
  client: z.string().min(1, { message: "Client name is required" }),
  client_email: z.string().email({ message: "Invalid email" }).optional().or(z.literal('')),
  client_phone: z.string().optional().or(z.literal('')),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zip: z.string().min(1, { message: "ZIP code is required" }),
  property_type: z.string().min(1, { message: "Property type is required" }),
  square_feet: z.coerce.number().positive({ message: "Square feet must be a positive number" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  package: z.string().min(1, { message: "Package is required" }),
  photographer: z.string().optional(),
  notes: z.string().optional(),
  internal_notes: z.string().optional(),
  customer_notes: z.string().optional()
});

type FormData = z.infer<typeof formSchema>;

type CreateAppointmentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  initialTime?: string;
  onAppointmentAdded?: (appointmentData: any) => Promise<boolean>;
  existingOrderData?: any;
};

export function CreateAppointmentDialog({ 
  isOpen, 
  onClose, 
  selectedDate,
  initialTime,
  onAppointmentAdded,
  existingOrderData
}: CreateAppointmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | undefined>(selectedDate);
  const [selectedTime, setSelectedTime] = useState<string>(initialTime || "11:00 AM");
  const [selectedDuration, setSelectedDuration] = useState<string>("45 minutes");
  const isMobile = useIsMobile();

  // Set up the form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client: existingOrderData?.client || '',
      client_email: existingOrderData?.client_email || '',
      client_phone: existingOrderData?.client_phone || '',
      address: existingOrderData?.address || '',
      city: existingOrderData?.city || '',
      state: existingOrderData?.state || '',
      zip: existingOrderData?.zip || '',
      property_type: existingOrderData?.property_type || 'Residential',
      square_feet: existingOrderData?.square_feet || 2000,
      price: existingOrderData?.price || 199,
      package: existingOrderData?.package || 'Standard',
      photographer: existingOrderData?.photographer || '',
      notes: existingOrderData?.notes || '',
      internal_notes: existingOrderData?.internal_notes || '',
      customer_notes: existingOrderData?.customer_notes || ''
    }
  });

  useEffect(() => {
    if (selectedDate) {
      setSelectedDateTime(selectedDate);
    }
  }, [selectedDate]);

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDateTime(date);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const handleDurationChange = (duration: string) => {
    setSelectedDuration(duration);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Generate an order number
      const orderNumber = `ORD-${Math.floor(Math.random() * 10000)}`;
      
      // Prepare the order data
      const orderData = {
        ...data,
        order_number: orderNumber,
        scheduled_date: format(selectedDateTime || new Date(), 'yyyy-MM-dd'),
        scheduled_time: selectedTime,
        status: 'scheduled'
      };
      
      // Insert the order into Supabase
      const { data: newOrder, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast.success(`Order ${orderNumber} created successfully!`);
      onClose();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={isMobile ? "sm:max-w-full max-h-[95vh] overflow-y-auto" : "sm:max-w-[900px] max-h-[80vh] overflow-y-auto"}>
        <DialogHeader>
          <DialogTitle>
            {existingOrderData 
              ? `Add Appointment to Order #${existingOrderData.orderNumber || existingOrderData.order_number}` 
              : "Create New Appointment"}
          </DialogTitle>
          <DialogDescription>
            Fill out all the required fields to create a new order
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Scheduling */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Scheduling</h3>
                <SuggestedDates onDateSelect={handleDateChange} />
                
                <DateTimeSelector
                  selectedDate={selectedDateTime}
                  selectedTime={selectedTime}
                  onDateChange={handleDateChange}
                  onTimeChange={handleTimeChange}
                  isMobile={isMobile}
                />
                
                <DurationSelector
                  selectedDuration={selectedDuration}
                  onDurationChange={handleDurationChange}
                />
                
                <NotificationSelector />
              </div>
              
              {/* Right Column: Order Details */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Order Details</h3>
                
                {/* Client Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Client Information</h4>
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Client name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="client_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="client@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="client_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Property Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Property Information</h4>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP</FormLabel>
                          <FormControl>
                            <Input placeholder="ZIP" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Package Information */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Package Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="property_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type</FormLabel>
                          <FormControl>
                            <Input placeholder="Residential" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="square_feet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Square Feet</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="2000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="package"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package</FormLabel>
                          <FormControl>
                            <Input placeholder="Standard" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="199" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Photographer */}
                <FormField
                  control={form.control}
                  name="photographer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photographer</FormLabel>
                      <FormControl>
                        <Input placeholder="Unassigned" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Notes */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Notes</h4>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>General Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Any general notes about this appointment..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="internal_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Internal Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Notes for internal reference only..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="customer_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Notes from or for the customer..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Order'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
