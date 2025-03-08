
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
import { DateTimeSelector } from './appointment/components/DateTimeSelector';
import { DurationSelector } from './appointment/components/DurationSelector';
import { NotificationSelector } from './appointment/components/NotificationSelector';
import { supabase } from '@/integrations/supabase/client';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

// ToggleSection component for collapsible sections
const ToggleSection = ({ 
  title, 
  children, 
  isOpen, 
  onToggle 
}: { 
  title: string; 
  children: React.ReactNode; 
  isOpen: boolean; 
  onToggle: () => void 
}) => {
  return (
    <div className="border rounded-md mb-4">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer bg-muted/30"
        onClick={onToggle}
      >
        <h3 className="text-lg font-medium">{title}</h3>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>
      {isOpen && (
        <div className="p-4 border-t">
          {children}
        </div>
      )}
    </div>
  );
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
  const [selectedNotification, setSelectedNotification] = useState<string>("Email");
  const isMobile = useIsMobile();
  const [googleLoaded, setGoogleLoaded] = useState(false);
  
  // Toggle state for each section
  const [schedulingOpen, setSchedulingOpen] = useState(true);
  const [addressOpen, setAddressOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [photographerOpen, setPhotographerOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [customItemsOpen, setCustomItemsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

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

  // Google Maps Autocomplete Setup
  useEffect(() => {
    const initializeGoogleMaps = () => {
      if (window.google && window.google.maps && !googleLoaded) {
        const addressInput = document.getElementById('address');
        if (addressInput) {
          const autocomplete = new window.google.maps.places.Autocomplete(addressInput as HTMLInputElement);
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            
            if (place.address_components) {
              // Extract components
              let street = '';
              let city = '';
              let state = '';
              let zip = '';
              
              place.address_components.forEach(component => {
                const types = component.types;
                
                if (types.includes('street_number')) {
                  street = component.long_name;
                } else if (types.includes('route')) {
                  street += (street ? ' ' : '') + component.long_name;
                } else if (types.includes('locality')) {
                  city = component.long_name;
                } else if (types.includes('administrative_area_level_1')) {
                  state = component.short_name;
                } else if (types.includes('postal_code')) {
                  zip = component.long_name;
                }
              });
              
              form.setValue('address', street || place.formatted_address || '');
              form.setValue('city', city);
              form.setValue('state', state);
              form.setValue('zip', zip);
            }
          });
        }
        setGoogleLoaded(true);
      }
    };

    // Initialize Google Maps if the script is already loaded
    if (window.google && window.google.maps) {
      initializeGoogleMaps();
    } else {
      // Add a listener for when the script loads
      window.addEventListener('google-maps-loaded', initializeGoogleMaps);
    }

    return () => {
      window.removeEventListener('google-maps-loaded', initializeGoogleMaps);
    };
  }, [googleLoaded, form]);

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

  const handleNotificationMethodChange = (method: string) => {
    setSelectedNotification(method);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Generate an order number
      const orderNumber = `ORD-${Math.floor(Math.random() * 10000)}`;
      
      // Prepare the order data - include all required fields
      const orderData = {
        order_number: orderNumber,
        client: data.client,
        client_email: data.client_email,
        client_phone: data.client_phone,
        address: data.address,
        city: data.city, 
        state: data.state,
        zip: data.zip,
        scheduled_date: format(selectedDateTime || new Date(), 'yyyy-MM-dd'),
        scheduled_time: selectedTime,
        property_type: data.property_type,
        square_feet: data.square_feet,
        package: data.package,
        price: data.price,
        photographer: data.photographer,
        notes: data.notes,
        internal_notes: data.internal_notes,
        customer_notes: data.customer_notes,
        status: 'scheduled',
        notification_method: selectedNotification
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
      
      // Call the onAppointmentAdded callback if provided
      if (onAppointmentAdded) {
        await onAppointmentAdded(newOrder?.[0] || orderData);
      }
      
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
            <div className="space-y-4">
              {/* Scheduling Section */}
              <ToggleSection 
                title="Scheduling" 
                isOpen={schedulingOpen} 
                onToggle={() => setSchedulingOpen(!schedulingOpen)}
              >
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
                
                <NotificationSelector 
                  onNotificationMethodChange={handleNotificationMethodChange}
                  defaultMethod={selectedNotification}
                />
              </ToggleSection>
              
              {/* Address Section with Google Maps Autocomplete */}
              <ToggleSection 
                title="Property Information" 
                isOpen={addressOpen} 
                onToggle={() => setAddressOpen(!addressOpen)}
              >
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input id="address" placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
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
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
              </ToggleSection>
              
              {/* Customer Section */}
              <ToggleSection 
                title="Client Information" 
                isOpen={customerOpen} 
                onToggle={() => setCustomerOpen(!customerOpen)}
              >
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
              </ToggleSection>
              
              {/* Package Information Section */}
              <ToggleSection 
                title="Package Information" 
                isOpen={productOpen} 
                onToggle={() => setProductOpen(!productOpen)}
              >
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
              </ToggleSection>
              
              {/* Custom Items Section */}
              <ToggleSection 
                title="Custom Items" 
                isOpen={customItemsOpen} 
                onToggle={() => setCustomItemsOpen(!customItemsOpen)}
              >
                <div className="text-sm text-muted-foreground">
                  Custom items functionality will be implemented soon.
                </div>
              </ToggleSection>
              
              {/* Photographer Section */}
              <ToggleSection 
                title="Photographer Assignment" 
                isOpen={photographerOpen} 
                onToggle={() => setPhotographerOpen(!photographerOpen)}
              >
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
              </ToggleSection>
              
              {/* Notes Section */}
              <ToggleSection 
                title="Notes" 
                isOpen={notesOpen} 
                onToggle={() => setNotesOpen(!notesOpen)}
              >
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
                    <FormItem className="mt-4">
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
                    <FormItem className="mt-4">
                      <FormLabel>Customer Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Notes from or for the customer..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </ToggleSection>
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
