
import React from 'react';
import { useForm } from 'react-hook-form';
import { Order } from '@/types/orders';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

type OrderFormData = Omit<Order, 'id'>;

interface CreateOrderFormProps {
  onSubmit: (data: OrderFormData) => void;
  onCancel: () => void;
}

export const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ onSubmit, onCancel }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<OrderFormData>({
    defaultValues: {
      status: 'pending',
    }
  });

  const submitHandler = (data: OrderFormData) => {
    try {
      onSubmit(data);
      toast({
        title: "Order created successfully",
        description: "Your order has been created.",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error creating order",
        description: "There was a problem creating your order.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Client Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Client Information</h3>
          
          <div>
            <label className="block text-sm font-medium mb-1">Client Name</label>
            <Input {...register('client', { required: true })} placeholder="Client name" />
            {errors.client && <p className="text-red-500 text-xs mt-1">Client name is required</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input {...register('clientEmail', { required: true })} type="email" placeholder="client@example.com" />
            {errors.clientEmail && <p className="text-red-500 text-xs mt-1">Email is required</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input {...register('clientPhone')} placeholder="(555) 123-4567" />
          </div>
        </div>
        
        {/* Property Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Property Information</h3>
          
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <Input {...register('address', { required: true })} placeholder="123 Main St" />
            {errors.address && <p className="text-red-500 text-xs mt-1">Address is required</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <Input {...register('city', { required: true })} placeholder="City" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <Input {...register('state', { required: true })} placeholder="State" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Zip Code</label>
              <Input {...register('zip', { required: true })} placeholder="12345" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Square Feet</label>
              <Input {...register('squareFeet', { valueAsNumber: true })} type="number" placeholder="2000" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Property Type</label>
            <Select 
              onValueChange={(value) => setValue('propertyType', value)}
              defaultValue="residential"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="land">Land</SelectItem>
                <SelectItem value="multi-family">Multi-Family</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Order Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Order Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Order Number</label>
            <Input {...register('orderNumber', { required: true })} placeholder="ORD-12345" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input {...register('scheduledDate', { required: true })} type="date" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <Input {...register('scheduledTime', { required: true })} type="time" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Package</label>
            <Select onValueChange={(value) => setValue('package', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select package" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic Photos</SelectItem>
                <SelectItem value="premium">Premium Photos</SelectItem>
                <SelectItem value="deluxe">Deluxe Package</SelectItem>
                <SelectItem value="twilight">Twilight Package</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <Input {...register('price', { valueAsNumber: true, required: true })} type="number" placeholder="299.99" />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Customer Notes</label>
          <Textarea {...register('customerNotes')} placeholder="Notes from the customer..." />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Internal Notes</label>
          <Textarea {...register('internalNotes')} placeholder="Internal notes..." />
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Order
        </Button>
      </div>
    </form>
  );
};
