
import React, { useState, useEffect, useRef } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ToggleSection } from '../components/ToggleSection';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

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
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Define refs for Google Maps services
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  
  // Initialize Google Maps Services
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && window.google.maps && window.google.maps.places) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      
      // Create a dummy div for PlacesService (it needs a DOM element)
      const dummyDiv = document.createElement('div');
      placesServiceRef.current = new window.google.maps.places.PlacesService(dummyDiv);
    }
  }, []);

  // Handle address search with Google Places API
  const handleAddressSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    form.setValue('address', query);
    
    if (query.length < 3 || !autocompleteServiceRef.current) {
      setAddressSuggestions([]);
      return;
    }
    
    setIsSearching(true);
    
    // Use Google Places Autocomplete with location bias for Australia
    autocompleteServiceRef.current.getPlacePredictions({
      input: query,
      componentRestrictions: { country: 'au' }, // Restrict to Australia
      types: ['address']
    }, (predictions: google.maps.places.AutocompletePrediction[] | null, status: google.maps.places.PlacesServiceStatus) => {
      setIsSearching(false);
      
      if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
        setAddressSuggestions([]);
        return;
      }
      
      setAddressSuggestions(predictions);
    });
  };
  
  const handleSelectAddress = (prediction: google.maps.places.AutocompletePrediction) => {
    if (!placesServiceRef.current) {
      form.setValue('address', prediction.description);
      setAddressSuggestions([]);
      return;
    }
    
    // Get place details to extract components like city, state, zip
    placesServiceRef.current.getDetails({
      placeId: prediction.place_id,
      fields: ['address_components', 'formatted_address']
    }, (place: google.maps.places.PlaceResult | null, status: google.maps.places.PlacesServiceStatus) => {
      if (status !== google.maps.places.PlacesServiceStatus.OK || !place) {
        form.setValue('address', prediction.description);
        setAddressSuggestions([]);
        return;
      }
      
      // Set the full address
      form.setValue('address', place.formatted_address || prediction.description);
      form.setValue('propertyAddress', place.formatted_address || prediction.description);
      
      // Extract and set address components
      if (place.address_components) {
        let city = '';
        let state = '';
        let zip = '';
        
        for (const component of place.address_components) {
          const types = component.types;
          
          if (types.includes('locality')) {
            city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            state = component.short_name; // e.g., VIC, NSW
          } else if (types.includes('postal_code')) {
            zip = component.long_name;
          }
        }
        
        form.setValue('city', city);
        form.setValue('state', state);
        form.setValue('zip', zip);
        
        // Show manual fields if we have extracted address components
        if (city || state || zip) {
          setShowManualFields(true);
        }
      }
      
      setAddressSuggestions([]);
    });
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
                        placeholder="Search for an Australian address..." 
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
                  {addressSuggestions.map((prediction) => (
                    <li
                      key={prediction.place_id}
                      className="px-4 py-2 hover:bg-muted cursor-pointer"
                      onClick={() => handleSelectAddress(prediction)}
                    >
                      <div className="font-medium">{prediction.description}</div>
                      <div className="text-xs text-muted-foreground">
                        {prediction.structured_formatting?.secondary_text}
                      </div>
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
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Square Feet</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="2000" 
                    value={value || ''} 
                    onChange={(e) => onChange(Number(e.target.value))}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="199" 
                    value={value || ''} 
                    onChange={(e) => onChange(Number(e.target.value))}
                    {...field} 
                  />
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
