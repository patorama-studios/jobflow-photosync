
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createOrder } from '@/services/order-service';
import { OrderStatus } from '@/types/order-types';

// Import our new section components
import { ClientSection } from './form/ClientSection';
import { PropertySection } from './form/PropertySection';
import { SchedulingSection } from './form/SchedulingSection';
import { NotesSection } from './form/NotesSection';

interface CreateOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated?: () => void;
}

export function CreateOrderDialog({ isOpen, onClose, onOrderCreated }: CreateOrderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    clientEmail: '',
    clientPhone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    propertyType: 'Residential',
    squareFeet: 2000,
    price: 199,
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '10:00 AM',
    photographer: '',
    photographerPayoutRate: 100,
    package: 'Standard Photography Package',
    status: 'scheduled' as OrderStatus,
    customerNotes: '',
    internalNotes: ''
  });

  // Toggleable sections
  const [clientSectionOpen, setClientSectionOpen] = useState(true);
  const [propertySectionOpen, setPropertySectionOpen] = useState(false);
  const [schedulingSectionOpen, setSchedulingSectionOpen] = useState(false);
  const [notesSectionOpen, setNotesSectionOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Generate an order number
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      
      const orderData = {
        ...formData,
        orderNumber
      };
      
      const result = await createOrder(orderData);
      
      if (result.success) {
        toast.success('Order created successfully');
        if (onOrderCreated) {
          onOrderCreated();
        }
        onClose();
      } else {
        toast.error(`Failed to create order: ${result.error}`);
      }
    } catch (error: any) {
      toast.error(`Error creating order: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new photography order.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information Section */}
          <ClientSection 
            isOpen={clientSectionOpen}
            onToggle={() => setClientSectionOpen(!clientSectionOpen)}
            formData={formData}
            handleInputChange={handleInputChange}
          />
          
          {/* Property Information Section */}
          <PropertySection 
            isOpen={propertySectionOpen}
            onToggle={() => setPropertySectionOpen(!propertySectionOpen)}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
          
          {/* Scheduling Section */}
          <SchedulingSection 
            isOpen={schedulingSectionOpen}
            onToggle={() => setSchedulingSectionOpen(!schedulingSectionOpen)}
            formData={formData}
            handleInputChange={handleInputChange}
          />
          
          {/* Notes Section */}
          <NotesSection 
            isOpen={notesSectionOpen}
            onToggle={() => setNotesSectionOpen(!notesSectionOpen)}
            formData={formData}
            handleInputChange={handleInputChange}
          />
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
