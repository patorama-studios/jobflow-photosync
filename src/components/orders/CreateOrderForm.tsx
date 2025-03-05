
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';

export interface CreateOrderFormProps {
  onComplete?: () => void;
}

const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ onComplete }) => {
  const form = useForm({
    defaultValues: {
      customerName: '',
      propertyAddress: '',
      orderDate: '',
    }
  });

  const onSubmit = (data: any) => {
    console.log('Form submitted:', data);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter customer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="propertyAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter property address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="orderDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onComplete}>Cancel</Button>
          <Button type="submit">Create Order</Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateOrderForm;
