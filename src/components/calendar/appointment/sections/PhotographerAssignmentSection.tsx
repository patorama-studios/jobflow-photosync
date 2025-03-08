
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ToggleSection } from '../components/ToggleSection';
import { UseFormReturn } from 'react-hook-form';

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
  return (
    <ToggleSection 
      title="Photographer Assignment" 
      isOpen={isOpen} 
      onToggle={onToggle}
    >
      <FormField
        control={form.control}
        name="photographer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Photographer</FormLabel>
            <FormControl>
              <Input placeholder="Unassigned" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </ToggleSection>
  );
};
