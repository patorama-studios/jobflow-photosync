
import React, { useState } from 'react';
import { Address, extractAddressComponents, formatAddress } from '@/lib/address-utils';
import { AddressDetails } from '@/hooks/google-maps/types';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { GoogleMapsInput } from './address/GoogleMapsInput';
import { AddressMap } from './address/AddressMap';
import { AddressDisplay } from './address/AddressDisplay';
import { Button } from '@/components/ui/button';
import { MapPin, Edit } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface AddressSectionProps {
  form: UseFormReturn<any>;
  onChange?: (address: Address) => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({ form, onChange }) => {
  const [addressDetails, setAddressDetails] = useState<AddressDetails | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  
  const handleAddressSelect = (details: AddressDetails) => {
    setAddressDetails(details);
    setShowMap(true);
    
    if (onChange) {
      onChange({
        street: details.streetAddress,
        city: details.city,
        state: details.state,
        zip: details.zip,
        lat: 0, // These would come from the Google Maps API
        lng: 0, // These would come from the Google Maps API
        formatted_address: details.formatted_address
      });
    }
    
    // Update the form
    form.setValue('address', details.formatted_address || '');
    form.setValue('city', details.city || '');
    form.setValue('state', details.state || '');
    form.setValue('zip', details.zip || '');
  };
  
  const toggleManualMode = () => {
    setManualMode(!manualMode);
    setShowMap(false);
  };
  
  const updateAddressFromManualForm = () => {
    const streetAddress = form.getValues('address');
    const city = form.getValues('city');
    const state = form.getValues('state');
    const zip = form.getValues('zip');
    
    if (streetAddress && city && state && zip) {
      const fullAddress = `${streetAddress}, ${city}, ${state} ${zip}`;
      
      // Create a simplified address details object
      const manualAddressDetails: AddressDetails = {
        streetAddress: streetAddress || '',
        city: city || '',
        state: state || '',
        zip: zip || '',
        formatted_address: fullAddress
      };
      
      setAddressDetails(manualAddressDetails);
      
      if (onChange) {
        onChange({
          street: streetAddress,
          city,
          state,
          zip,
          formatted_address: fullAddress,
          lat: 0, // Default value
          lng: 0  // Default value
        });
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">Property Information</h3>
        <Button variant="outline" size="sm" onClick={toggleManualMode}>
          {manualMode ? 'Use Address Search' : 'Enter Manually'}
        </Button>
      </div>
      
      {!manualMode ? (
        // Google Maps search mode
        <div className="space-y-4">
          <GoogleMapsInput
            onAddressSelect={handleAddressSelect}
          />
          
          {showMap && addressDetails && (
            <div className="mt-4 space-y-4">
              <AddressDisplay address={addressDetails.formatted_address || ''} />
              
              {/* Only render the map if we have coordinates */}
              {addressDetails.formatted_address && (
                <AddressMap
                  address={addressDetails.formatted_address}
                  lat={0} // These would come from Google Maps API
                  lng={0} // These would come from Google Maps API
                />
              )}
            </div>
          )}
        </div>
      ) : (
        // Manual entry mode
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Street address" 
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="City"
                      {...field}
                    />
                  </FormControl>
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
                    <Input
                      placeholder="State"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Zip/Postal Code"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <Button
            type="button"
            variant="secondary"
            onClick={updateAddressFromManualForm}
            className="mt-2"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Update Address
          </Button>
        </div>
      )}
    </div>
  );
};
