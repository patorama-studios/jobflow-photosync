
import React from 'react';
import { PropertySectionHeader } from './property/PropertySectionHeader';
import { AddressSearchField } from './property/AddressSearchField';
import { AddressSuggestionsList } from './property/AddressSuggestionsList';
import { ManualAddressFields } from './property/ManualAddressFields';
import { useGoogleAddressSearch } from '@/hooks/use-google-address-search';
import { FormSection } from '../components/FormSection';
import { UseFormReturn } from 'react-hook-form';
import { ToggleSection } from '../components/ToggleSection';

interface PropertyInformationSectionProps {
  form: UseFormReturn<any>;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const PropertyInformationSection: React.FC<PropertyInformationSectionProps> = ({ 
  form, 
  isOpen, 
  onToggle 
}) => {
  const {
    showManualFields,
    addressSuggestions,
    isSearching,
    handleAddressSearch,
    handleSelectAddress,
    toggleManualFields
  } = useGoogleAddressSearch(form);

  // If we're being used with a toggle section wrapper
  if (isOpen !== undefined && onToggle) {
    return (
      <ToggleSection
        title="Property Information"
        isOpen={isOpen}
        onToggle={onToggle}
      >
        <PropertyContent 
          form={form}
          showManualFields={showManualFields}
          addressSuggestions={addressSuggestions}
          isSearching={isSearching}
          handleAddressSearch={handleAddressSearch}
          handleSelectAddress={handleSelectAddress}
          toggleManualFields={toggleManualFields}
        />
      </ToggleSection>
    );
  }

  // If we're being used standalone
  return (
    <FormSection>
      <PropertyContent 
        form={form}
        showManualFields={showManualFields}
        addressSuggestions={addressSuggestions}
        isSearching={isSearching}
        handleAddressSearch={handleAddressSearch}
        handleSelectAddress={handleSelectAddress}
        toggleManualFields={toggleManualFields}
      />
    </FormSection>
  );
};

// Extract the actual content to a separate component to avoid duplication
interface PropertyContentProps {
  form: UseFormReturn<any>;
  showManualFields: boolean;
  addressSuggestions: any[];
  isSearching: boolean;
  handleAddressSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectAddress: (prediction: any) => void;
  toggleManualFields: () => void;
}

const PropertyContent: React.FC<PropertyContentProps> = ({
  form,
  showManualFields,
  addressSuggestions,
  isSearching,
  handleAddressSearch,
  handleSelectAddress,
  toggleManualFields
}) => {
  return (
    <>
      <PropertySectionHeader 
        showManualFields={showManualFields} 
        toggleManualFields={toggleManualFields} 
      />

      <div className="relative mb-4">
        <AddressSearchField 
          form={form} 
          onAddressSearch={handleAddressSearch} 
        />
        
        <AddressSuggestionsList 
          suggestions={addressSuggestions} 
          isSearching={isSearching} 
          onSelectAddress={handleSelectAddress} 
        />
      </div>

      {showManualFields && (
        <ManualAddressFields form={form} />
      )}
    </>
  );
};
