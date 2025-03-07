
import React, { memo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useGoogleAutocomplete } from '@/hooks/use-google-autocomplete';
import { ParsedAddress } from '@/lib/address-utils';

interface GoogleAddressAutocompleteProps {
  onAddressSelect: (address: ParsedAddress) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  required?: boolean;
  region?: string;
  disabled?: boolean;
  id?: string;
}

// Memoize the component to prevent unnecessary re-renders
export const GoogleAddressAutocomplete = memo(({
  onAddressSelect,
  placeholder = "Search an address...",
  defaultValue = "",
  className = "",
  required = false,
  region,
  disabled = false,
  id = "google-address-autocomplete"
}: GoogleAddressAutocompleteProps) => {
  const {
    inputRef,
    inputValue,
    error,
    handleInputChange,
    handleInputFocus
  } = useGoogleAutocomplete({
    onAddressSelect,
    defaultValue,
    region
  });
  
  return (
    <div className="relative w-full">
      <Search 
        className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" 
        aria-hidden="true" 
      />
      <Input
        id={id}
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={error ? `${error} - ${placeholder}` : placeholder}
        className={cn("pl-9", className)}
        required={required}
        disabled={disabled}
        aria-label="Address search"
        autoComplete="off"
      />
      {error && (
        <div className="text-sm text-destructive mt-1">
          {error}. You may need to enter the address manually.
        </div>
      )}
    </div>
  );
});

GoogleAddressAutocomplete.displayName = 'GoogleAddressAutocomplete';
