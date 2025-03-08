
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ToggleSection } from '../components/ToggleSection';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { MapPin, Plus } from 'lucide-react';

interface PropertyInformationSectionProps {
  form: UseFormReturn<any>;
  isOpen: boolean;
  onToggle: () => void;
}

export const PropertyInformationSection: React.FC<PropertyInformationSectionProps> = ({
  form,
  isOpen,
  onToggle
}) => {
  const [showManualFields, setShowManualFields] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleAddressSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    form.setValue('address', query);
    
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    
    setIsSearching(true);
    
    // This would normally use the Google Places API
    // For now, let's simulate some suggestions
    setTimeout(() => {
      if (query.length >= 3) {
        setAddressSuggestions([
          `${query}, 123 Main St`,
          `${query}, 456 Oak Ave`,
          `${query}, 789 Pine Blvd`
        ]);
      } else {
        setAddressSuggestions([]);
      }
      setIsSearching(false);
    }, 300);
  };
  
  const handleSelectAddress = (address: string) => {
    form.setValue('address', address);
    
    // Normally, we would parse the address and set city, state, zip
    // For now, let's just simulate this
    const parts = address.split(', ');
    if (parts.length > 1) {
      form.setValue('city', 'Sample City');
      form.setValue('state', 'CA');
      form.setValue('zip', '90210');
    }
    
    setAddressSuggestions([]);
  };
  
  const toggleManualFields = () => {
    setShowManualFields(!showManualFields);
  };

  return (
    <ToggleSection 
      title="Property Information" 
      isOpen={isOpen} 
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <div className="relative">
          <div className="flex items-center space-x-2 mb-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Address</FormLabel>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <FormControl>
                      <Input 
                        placeholder="Search for an address..." 
                        className="pl-10"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleAddressSearch(e);
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="button" 
              variant="outline" 
              className="mt-8" 
              onClick={toggleManualFields}
            >
              {showManualFields ? "Hide Manual" : "Add Manually"}
            </Button>
          </div>
          
          {addressSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 border rounded-md bg-background shadow-lg">
              {isSearching ? (
                <div className="p-2 text-center text-sm">Searching...</div>
              ) : (
                <ul>
                  {addressSuggestions.map((address, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-muted cursor-pointer"
                      onClick={() => handleSelectAddress(address)}
                    >
                      <div className="font-medium">{address}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        
        {showManualFields && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
          </div>
        )}
        
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
      </div>
    </ToggleSection>
  );
};
