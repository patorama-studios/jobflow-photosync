
import React from 'react';
import { ToggleSection } from '../components/ToggleSection';
import { UseFormReturn } from 'react-hook-form';
import { PhotographerSearch } from '../components/PhotographerSearch';
import { Photographer } from '@/hooks/use-photographers';

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
  const handlePhotographerSelect = (photographer: Photographer) => {
    form.setValue('photographer', photographer.name);
    form.setValue('photographer_id', photographer.id);
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
