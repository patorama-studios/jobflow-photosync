
import React from 'react';
import { PropertySectionHeader } from './property/PropertySectionHeader';
import { AddressSearchField } from './property/AddressSearchField';
import { ManualAddressFields } from './property/ManualAddressFields';
import { FormSection } from '../components/FormSection';
import { UseFormReturn } from 'react-hook-form';
import { ToggleSection } from '../components/ToggleSection';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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
  // If we're being used with a toggle section wrapper
  if (isOpen !== undefined && onToggle) {
    return (
      <ToggleSection
        title="Property Information"
        isOpen={isOpen}
        onToggle={onToggle}
      >
        <ErrorBoundary>
          <PropertyContent form={form} />
        </ErrorBoundary>
      </ToggleSection>
    );
  }

  // If we're being used standalone
  return (
    <FormSection>
      <ErrorBoundary>
        <PropertyContent form={form} />
      </ErrorBoundary>
    </FormSection>
  );
};

// Extract the actual content to a separate component
interface PropertyContentProps {
  form: UseFormReturn<any>;
}

const PropertyContent: React.FC<PropertyContentProps> = ({ form }) => {
  return (
    <>
      <PropertySectionHeader 
        showManualFields={true} 
        toggleManualFields={() => {}}
      />

      <div className="mb-4">
        <AddressSearchField form={form} />
      </div>

      <ManualAddressFields form={form} />
    </>
  );
};
