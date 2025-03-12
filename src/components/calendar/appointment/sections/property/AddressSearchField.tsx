
import React from 'react';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface AddressSearchFieldProps {
  form: UseFormReturn<any>;
}

export const AddressSearchField: React.FC<AddressSearchFieldProps> = ({
  form
}) => {
  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <FormControl>
              <Input 
                placeholder="Enter property address..." 
                className="pl-10"
                {...field}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
