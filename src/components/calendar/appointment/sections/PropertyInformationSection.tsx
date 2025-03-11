
import React from 'react';
import { PropertySectionHeader } from './property/PropertySectionHeader';
import { AddressSearchField } from './property/AddressSearchField';
import { AddressSuggestionsList } from './property/AddressSuggestionsList';
import { ManualAddressFields } from './property/ManualAddressFields';
import { useGoogleAddressSearch } from '@/hooks/use-google-address-search';
import { FormSection } from '../components/FormSection';
import { UseFormReturn } from 'react-hook-form';

interface PropertyInformationSectionProps {
  form: UseFormReturn<any>;
}

export const PropertyInformationSection: React.FC<PropertyInformationSectionProps> = ({ form }) => {
  const {
    showManualFields,
    addressSuggestions,
    isSearching,
    handleAddressSearch,
    handleSelectAddress,
    toggleManualFields
  } = useGoogleAddressSearch(form);

  return (
    <FormSection>
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
    </FormSection>
  );
};
