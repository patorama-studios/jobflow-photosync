
import React from 'react';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Loader2, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface AddressSearchFieldProps {
  form: UseFormReturn<any>;
  onAddressSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSearching?: boolean;
}

export const AddressSearchField: React.FC<AddressSearchFieldProps> = ({
  form,
  onAddressSearch,
  isSearching = false
}) => {
  const clearSearch = () => {
    form.setValue('address', '');
    // Create a synthetic event to trigger the search handler
    const event = {
      target: { value: '' }
    } as React.ChangeEvent<HTMLInputElement>;
    onAddressSearch(event);
  };

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
                placeholder="Search for an Australian address..." 
                className="pl-10 pr-10"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  onAddressSearch(e);
                }}
                autoComplete="off" // Disable browser autocomplete to prevent conflicts
              />
            </FormControl>
            {isSearching ? (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
              </div>
            ) : field.value ? (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button 
                  type="button"
                  onClick={clearSearch}
                  className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
