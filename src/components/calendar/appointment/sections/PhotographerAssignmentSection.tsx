
import React from 'react';
import { ToggleSection } from '../components/ToggleSection';
import { UseFormReturn } from 'react-hook-form';
import { PhotographerSearch } from '../components/PhotographerSearch';

interface PhotographerAssignmentSectionProps {
  form: UseFormReturn<any>;
  isOpen: boolean;
  onToggle: () => void;
}

export const PhotographerAssignmentSection: React.FC<PhotographerAssignmentSectionProps> = ({
  form,
  isOpen,
  onToggle
}) => {
  const handlePhotographerSelect = (photographer: any) => {
    form.setValue('photographer', photographer.name);
    form.setValue('photographer_id', photographer.id);
    form.setValue('photographerPayoutRate', photographer.payoutRate || 100);
  };

  return (
    <ToggleSection 
      title="Photographer Assignment" 
      isOpen={isOpen} 
      onToggle={onToggle}
    >
      <PhotographerSearch 
        onPhotographerSelect={handlePhotographerSelect}
        selectedPhotographer={form.watch('photographer')}
      />
    </ToggleSection>
  );
};
