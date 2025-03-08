
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ToggleSection } from '../components/ToggleSection';
import { UseFormReturn } from 'react-hook-form';

interface PackageInformationSectionProps {
  form: UseFormReturn<any>;
  isOpen: boolean;
  onToggle: () => void;
}

export const PackageInformationSection: React.FC<PackageInformationSectionProps> = ({
  form,
  isOpen,
  onToggle
}) => {
  return (
    <ToggleSection 
      title="Package Information" 
      isOpen={isOpen} 
      onToggle={onToggle}
    >
      <FormField
        control={form.control}
        name="package"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Package</FormLabel>
            <FormControl>
              <Input placeholder="Standard" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </ToggleSection>
  );
};
