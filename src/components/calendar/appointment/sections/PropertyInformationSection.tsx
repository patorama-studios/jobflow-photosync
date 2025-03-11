
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ToggleSection } from '../components/ToggleSection';
import { useGoogleAddressSearch } from '@/hooks/use-google-address-search';
import { PropertySectionHeader } from './property/PropertySectionHeader';
import { AddressSearchField } from './property/AddressSearchField';
import { AddressSuggestionsList } from './property/AddressSuggestionsList';
import { ManualAddressFields } from './property/ManualAddressFields';

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
  const {
    showManualFields,
    addressSuggestions,
    isSearching,
    handleAddressSearch,
    handleSelectAddress,
    toggleManualFields
  } = useGoogleAddressSearch(form);

  return (
    <ToggleSection 
      title="Property Information" 
      isOpen={isOpen} 
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <div className="relative">
          <PropertySectionHeader 
            showManualFields={showManualFields} 
            toggleManualFields={toggleManualFields} 
          />
          
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
      </div>
    </ToggleSection>
  );
};
