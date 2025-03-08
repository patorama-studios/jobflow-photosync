
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/hooks/use-products';

// Import our section components
import { SchedulingSection } from './appointment/sections/SchedulingSection';
import { PropertyInformationSection } from './appointment/sections/PropertyInformationSection';
import { ClientInformationSection } from './appointment/sections/ClientInformationSection';
import { ProductSelectionSection } from './appointment/sections/ProductSelectionSection';
import { CustomItemsSection } from './appointment/sections/CustomItemsSection';
import { PhotographerAssignmentSection } from './appointment/sections/PhotographerAssignmentSection';
import { NotesSection } from './appointment/sections/NotesSection';

// Define custom item interface
interface CustomItem {
  id: string;
  name: string;
  price: number;
}

// Define selected product interface
interface SelectedProduct extends Product {
  quantity: number;
}

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
  package: z.string().optional(),
  photographer: z.string().optional(),
  photographer_payout_rate: z.coerce.number().optional(),
  internal_notes: z.string().optional()
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
  const [selectedNotification, setSelectedNotification] = useState<string>("Email");
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
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
      package: existingOrderData?.package || '',
      photographer: existingOrderData?.photographer || '',
      photographer_payout_rate: existingOrderData?.photographer_payout_rate || 100,
      internal_notes: existingOrderData?.internal_notes || ''
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

  const handleAddCustomItem = (item: Omit<CustomItem, 'id'>) => {
    setCustomItems([...customItems, { ...item, id: `custom-${Date.now()}` }]);
    
    // Update total price
    const currentPrice = form.getValues('price') || 0;
    form.setValue('price', currentPrice + item.price);
  };

  const handleRemoveCustomItem = (id: string) => {
    const itemToRemove = customItems.find(item => item.id === id);
    if (!itemToRemove) return;
    
    setCustomItems(customItems.filter(item => item.id !== id));
    
    // Update total price
    const currentPrice = form.getValues('price') || 0;
    form.setValue('price', currentPrice - itemToRemove.price);
  };

  const handleProductsChange = (products: SelectedProduct[]) => {
    setSelectedProducts(products);
    
    // Update total price based on products
    const productsTotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const customItemsTotal = customItems.reduce((sum, item) => sum + item.price, 0);
    
    form.setValue('price', productsTotal + customItemsTotal);
    
    // Set package name from first product if available
    if (products.length > 0) {
      form.setValue('package', products[0].name);
    }
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
        package: data.package || (selectedProducts.length > 0 ? selectedProducts[0].name : 'Standard'),
        price: data.price,
        photographer: data.photographer,
        photographer_payout_rate: data.photographer_payout_rate,
        internal_notes: data.internal_notes,
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
      
      // If we have products, add them to order_products
      if (selectedProducts.length > 0 && newOrder && newOrder.length > 0) {
        const orderId = newOrder[0].id;
        
        const productRecords = selectedProducts.map(product => ({
          order_id: orderId,
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          description: product.description,
          status: 'to_do'
        }));
        
        const { error: productsError } = await supabase
          .from('order_products')
          .insert(productRecords);
          
        if (productsError) {
          console.error('Error adding products to order:', productsError);
        }
      }
      
      // If we have custom items, add them as order_products too
      if (customItems.length > 0 && newOrder && newOrder.length > 0) {
        const orderId = newOrder[0].id;
        
        const customItemRecords = customItems.map(item => ({
          order_id: orderId,
          name: item.name,
          price: item.price,
          quantity: 1,
          description: 'Custom item',
          status: 'to_do'
        }));
        
        const { error: customItemsError } = await supabase
          .from('order_products')
          .insert(customItemRecords);
          
        if (customItemsError) {
          console.error('Error adding custom items to order:', customItemsError);
        }
      }
      
      toast.success(`Order ${orderNumber} created successfully!`);
      
      // Call the onAppointmentAdded callback if provided
      if (onAppointmentAdded) {
        await onAppointmentAdded(newOrder?.[0] || orderData);
      }
      
      onClose();
    } catch (error: any) {
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
            Create New Order
          </DialogTitle>
          <DialogDescription>
            Fill out all the required fields to create a new order
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Scheduling Section */}
              <SchedulingSection 
                selectedDateTime={selectedDateTime}
                selectedTime={selectedTime}
                selectedDuration={selectedDuration}
                selectedNotification={selectedNotification}
                onDateChange={handleDateChange}
                onTimeChange={handleTimeChange}
                onDurationChange={handleDurationChange}
                onNotificationMethodChange={handleNotificationMethodChange}
                isOpen={schedulingOpen}
                onToggle={() => setSchedulingOpen(!schedulingOpen)}
                isMobile={isMobile}
              />
              
              {/* Address/Property Information Section */}
              <PropertyInformationSection
                form={form}
                isOpen={addressOpen}
                onToggle={() => setAddressOpen(!addressOpen)}
              />
              
              {/* Customer/Client Information Section */}
              <ClientInformationSection
                form={form}
                isOpen={customerOpen}
                onToggle={() => setCustomerOpen(!customerOpen)}
              />
              
              {/* Product Selection Section */}
              <ProductSelectionSection
                isOpen={productOpen}
                onToggle={() => setProductOpen(!productOpen)}
                selectedProducts={selectedProducts}
                onProductsChange={handleProductsChange}
              />
              
              {/* Custom Items Section */}
              <CustomItemsSection
                isOpen={customItemsOpen}
                onToggle={() => setCustomItemsOpen(!customItemsOpen)}
                items={customItems}
                onAddItem={handleAddCustomItem}
                onRemoveItem={handleRemoveCustomItem}
              />
              
              {/* Photographer Assignment Section */}
              <PhotographerAssignmentSection
                form={form}
                isOpen={photographerOpen}
                onToggle={() => setPhotographerOpen(!photographerOpen)}
              />
              
              {/* Notes Section */}
              <NotesSection
                form={form}
                isOpen={notesOpen}
                onToggle={() => setNotesOpen(!notesOpen)}
              />
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
