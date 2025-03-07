
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGoogleMaps } from '@/contexts/GoogleMapsContext';
import { toast } from 'sonner';
import { GoogleMapsInput } from './address/GoogleMapsInput';
import { ManualAddressForm } from './address/ManualAddressForm';
import { AddressDisplay } from './address/AddressDisplay';
import { SchedulingSection } from './scheduling/SchedulingSection';

interface AddressDetails {
  formattedAddress: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  lat: number;
  lng: number;
}

interface AddressSectionProps {
  addressDetails: AddressDetails;
  selectedPhotographer?: string;
  onAddressSelect: (address: {
    formattedAddress: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    lat: number;
    lng: number;
  }) => void;
  onScheduleSelect?: (date: Date, time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

export const AddressSection: React.FC<AddressSectionProps> = ({ 
  addressDetails, 
  selectedPhotographer,
  onAddressSelect,
  onScheduleSelect,
  selectedDate,
  selectedTime
}) => {
  const { error } = useGoogleMaps();
  const isMobile = useIsMobile();
  const [manualEntry, setManualEntry] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(selectedDate || new Date());
  const [time, setTime] = useState<string>(selectedTime || "9:00 AM");
  
  // Update manual entry when error changes
  useEffect(() => {
    if (error) {
      setManualEntry(true);
      toast.error("Google Maps could not be loaded. Please enter address manually.");
    }
  }, [error]);

  const handleManualAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Create a partial object with just the updated field
    const updatedField = { [name]: value };
    
    // Pass the updated address to parent, maintaining other values
    onAddressSelect({
      formattedAddress: name === 'streetAddress' ? 
        `${value}, ${addressDetails.city}, ${addressDetails.state} ${addressDetails.postalCode}` : 
        addressDetails.formattedAddress,
      streetAddress: name === 'streetAddress' ? value : addressDetails.streetAddress,
      city: name === 'city' ? value : addressDetails.city,
      state: name === 'state' ? value : addressDetails.state,
      postalCode: name === 'postalCode' ? value : addressDetails.postalCode,
      country: 'Australia', // Default to Australia
      lat: addressDetails.lat || 0,
      lng: addressDetails.lng || 0,
      ...updatedField
    });
  };

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    if (onScheduleSelect) {
      onScheduleSelect(newDate, time);
    }
  };
  
  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (onScheduleSelect) {
      onScheduleSelect(date, newTime);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Address</p>
        
        <GoogleMapsInput 
          addressDetails={addressDetails} 
          onAddressSelect={onAddressSelect} 
        />
        
        {!error && (
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setManualEntry(!manualEntry)}
              className="text-xs text-primary hover:underline"
            >
              {manualEntry ? "Use address search" : "Enter address manually"}
            </button>
          </div>
        )}
        
        {/* Manual address entry form */}
        {(manualEntry || error) && (
          <ManualAddressForm 
            addressDetails={addressDetails}
            onAddressChange={handleManualAddressInput}
          />
        )}
        
        {/* Display the address details with map */}
        {addressDetails.formattedAddress && !manualEntry && (
          <AddressDisplay 
            addressDetails={addressDetails} 
            isMobile={isMobile}
          />
        )}
      </div>
      
      {/* Date and Time section */}
      {onScheduleSelect && (
        <SchedulingSection
          date={date}
          time={time}
          address={addressDetails.formattedAddress}
          photographer={selectedPhotographer}
          onDateChange={handleDateChange}
          onTimeChange={handleTimeChange}
          lat={addressDetails.lat}
          lng={addressDetails.lng}
        />
      )}
    </div>
  );
}
