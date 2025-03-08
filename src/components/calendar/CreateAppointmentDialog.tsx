
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCreateAppointmentForm } from '@/hooks/use-create-appointment-form';

// Import our section components
import { SchedulingSection } from './appointment/sections/SchedulingSection';
import { PropertyInformationSection } from './appointment/sections/PropertyInformationSection';
import { ClientInformationSection } from './appointment/sections/ClientInformationSection';
import { ProductSelectionSection } from './appointment/sections/ProductSelectionSection';
import { CustomItemsSection } from './appointment/sections/CustomItemsSection';
import { PhotographerAssignmentSection } from './appointment/sections/PhotographerAssignmentSection';
import { NotesSection } from './appointment/sections/NotesSection';

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
  const isMobile = useIsMobile();
  
  // Use our custom hook to manage form state and logic
  const {
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
  } = useCreateAppointmentForm({
    selectedDate,
    initialTime,
    existingOrderData,
    onClose,
    onAppointmentAdded
  });

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
