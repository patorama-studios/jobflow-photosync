
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentDetailsForm } from './appointment/AppointmentDetailsForm';
import BlockAppointmentForm from './appointment/BlockAppointmentForm';
import { OrderDetailsForm } from './appointment/OrderDetailsForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type CreateAppointmentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  initialTime?: string;
  onAppointmentAdded?: (appointmentData: any) => Promise<boolean>;
  existingOrderData?: any; // For when adding an appointment to an existing order
};

export function CreateAppointmentDialog({ 
  isOpen, 
  onClose, 
  selectedDate,
  initialTime,
  onAppointmentAdded,
  existingOrderData
}: CreateAppointmentDialogProps) {
  const [activeTab, setActiveTab] = useState("appointment");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  // Set the initial tab based on whether we're adding to an existing order
  useEffect(() => {
    if (existingOrderData) {
      setActiveTab("appointment");
    }
  }, [existingOrderData, isOpen]);

  // Function to handle form submission
  const handleSubmit = async (formData: any, formType: string) => {
    setIsSubmitting(true);
    
    try {
      // If we have a custom handler for adding to an existing order
      if (existingOrderData && onAppointmentAdded) {
        const success = await onAppointmentAdded({
          ...formData,
          orderId: existingOrderData.id
        });
        
        if (success) {
          onClose();
        }
      } else {
        // Regular appointment creation logic
        console.log('Creating appointment:', formData, 'Type:', formType);
        
        if (formType === 'order') {
          // Create a new order in the database
          const { data, error } = await supabase
            .from('orders')
            .insert({
              order_number: `ORD-${Math.floor(Math.random() * 10000)}`,
              client: formData.client?.name || 'New Client',
              client_email: formData.client?.email || '',
              client_phone: formData.client?.phone || '',
              address: formData.address?.formatted_address || '',
              city: formData.address?.city || '',
              state: formData.address?.state || '',
              zip: formData.address?.postal_code || '',
              scheduled_date: formData.date,
              scheduled_time: formData.time,
              photographer: formData.photographer || 'Unassigned',
              property_type: formData.propertyType || 'Residential',
              square_feet: formData.squareFeet || 0,
              price: formData.price || 0,
              status: 'scheduled',
              internal_notes: formData.internalNotes || '',
              customer_notes: formData.customerNotes || '',
              package: formData.package || 'Standard'
            })
            .select();
          
          if (error) {
            throw error;
          }
          
          toast.success("Order created successfully!");
        } else {
          // Just creating a calendar appointment (not implementing the actual calendar here)
          toast.success("Appointment created successfully!");
        }
        
        onClose();
      }
    } catch (error) {
      console.error('Error creating appointment or order:', error);
      toast.error("Failed to create appointment");
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
            {existingOrderData
              ? "Add a new appointment to this order"
              : "Schedule a new appointment or create a new order"}
          </DialogDescription>
        </DialogHeader>

        {existingOrderData ? (
          // Simplified version when adding to existing order
          <div className="py-4">
            <AppointmentDetailsForm 
              selectedDate={selectedDate}
              defaultOrder={existingOrderData}
              isSubmitting={isSubmitting}
              onSubmit={(data) => handleSubmit(data, 'appointment')}
            />
          </div>
        ) : (
          // Full version with tabs
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="appointment">Appointment</TabsTrigger>
              <TabsTrigger value="order">New Order</TabsTrigger>
              <TabsTrigger value="block">Block Time</TabsTrigger>
            </TabsList>
            <TabsContent value="appointment">
              <AppointmentDetailsForm 
                selectedDate={selectedDate}
                initialTime={initialTime}
                isSubmitting={isSubmitting}
                onSubmit={(data) => handleSubmit(data, 'appointment')}
              />
            </TabsContent>
            <TabsContent value="order">
              <OrderDetailsForm 
                selectedDate={selectedDate}
                isSubmitting={isSubmitting}
                onSubmit={(data) => handleSubmit(data, 'order')}
              />
            </TabsContent>
            <TabsContent value="block">
              <BlockAppointmentForm 
                defaultDate={selectedDate}
                initialTime={initialTime}
                isSubmitting={isSubmitting}
                onSubmit={(data) => handleSubmit(data, 'block')}
              />
            </TabsContent>
          </Tabs>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
