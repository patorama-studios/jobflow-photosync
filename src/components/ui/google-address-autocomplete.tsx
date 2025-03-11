
import React, { useRef, useEffect } from 'react';
import { Input } from './input';
import { useGoogleAutocomplete, Address } from '@/hooks/use-google-autocomplete';
import { Label } from './label';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './form';
import { UseFormReturn } from 'react-hook-form';

interface GoogleAddressAutocompleteProps {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (address: Address) => void;
  className?: string;
  form?: UseFormReturn<any>;
  formField?: string;
  required?: boolean;
}

export const GoogleAddressAutocomplete: React.FC<GoogleAddressAutocompleteProps> = ({
  label,
  placeholder = 'Enter address',
  defaultValue = '',
  onChange,
  className = '',
  form,
  formField,
  required = false
}) => {
  const {
    address,
    inputRef,
    inputValue,
    error,
    initAutocomplete,
    handleInputChange,
    handleInputFocus,
    updateAddress
  } = useGoogleAutocomplete();
  
  const localInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize autocomplete when component mounts
  useEffect(() => {
    if (localInputRef.current) {
      initAutocomplete(localInputRef.current);
    }
  }, [initAutocomplete]);
  
  // Call onChange prop when address changes
  useEffect(() => {
    if (onChange && address.formattedAddress) {
      onChange(address);
    }
  }, [address, onChange]);

  // If we're using the form integration
  if (form && formField) {
    return (
      <FormField
        control={form.control}
        name={formField}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel>{label}{required && <span className="text-red-500 ml-1">*</span>}</FormLabel>}
            <FormControl>
              <Input
                ref={(el) => {
                  // Store in both refs
                  localInputRef.current = el;
                  // Only update form value when address is selected
                  field.onChange(address.formattedAddress || field.value);
                }}
                placeholder={placeholder}
                defaultValue={defaultValue}
                value={inputValue || field.value}
                onChange={(e) => {
                  handleInputChange(e);
                  // Don't update form yet - wait for selection
                }}
                onFocus={handleInputFocus}
                className={className}
                autoComplete="off"
              />
            </FormControl>
            {error && <FormMessage>{error}</FormMessage>}
          </FormItem>
        )}
      />
    );
  }

  // For standalone use without form integration
  return (
    <div className="space-y-2">
      {label && <Label>{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>}
      <Input
        ref={localInputRef}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        className={className}
        autoComplete="off"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
