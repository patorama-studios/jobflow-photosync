
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
    // If the photographer has a payout rate, set it
    if (photographer.payoutRate) {
      form.setValue('photographer_payout_rate', photographer.payoutRate);
    }
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
      
      <div className="mt-4">
        <FormField
          control={form.control}
          name="photographer_payout_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photographer Payout Rate</FormLabel>
              <FormControl>
                <Input type="number" placeholder="100" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </ToggleSection>
  );
};
