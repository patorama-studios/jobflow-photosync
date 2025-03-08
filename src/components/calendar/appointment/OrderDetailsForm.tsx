
import React from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface OrderDetailsFormProps {
  selectedDate?: Date;
  isSubmitting?: boolean;
  onSubmit: (data: any) => void;
}

export const OrderDetailsForm: React.FC<OrderDetailsFormProps> = ({
  selectedDate = new Date(),
  isSubmitting = false,
  onSubmit
}) => {
  // Simple implementation for placeholder
  const handleSubmit = () => {
    const formData = {
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: '10:00 AM',
      client: {
        name: 'New Client',
        email: 'client@example.com'
      },
      photographer: 'Unassigned',
      propertyType: 'Residential',
      squareFeet: 2000,
      price: 199,
      address: {
        formatted_address: '123 Main St, Anytown, USA',
        city: 'Anytown',
        state: 'CA',
        postal_code: '12345'
      }
    };
    
    onSubmit(formData);
  };
  
  return (
    <div className="space-y-4">
      <p>Selected date: {format(selectedDate, 'PP')}</p>
      <p className="text-muted-foreground">
        This is a placeholder for the order form. In a real implementation, this would include fields for client information, property details, services, and pricing.
      </p>
      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitting} 
        className="w-full"
      >
        {isSubmitting ? 'Creating...' : 'Create Order'}
      </Button>
    </div>
  );
};
