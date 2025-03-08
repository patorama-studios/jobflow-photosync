
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ToggleSection } from '../components/ToggleSection';
import { UseFormReturn } from 'react-hook-form';

interface NotesSectionProps {
  form: UseFormReturn<any>;
  isOpen: boolean;
  onToggle: () => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
  form,
  isOpen,
  onToggle
}) => {
  return (
    <ToggleSection 
      title="Notes" 
      isOpen={isOpen} 
      onToggle={onToggle}
    >
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>General Notes</FormLabel>
            <FormControl>
              <Textarea placeholder="Any general notes about this appointment..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="internal_notes"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Internal Notes</FormLabel>
            <FormControl>
              <Textarea placeholder="Notes for internal reference only..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="customer_notes"
        render={({ field }) => (
          <FormItem className="mt-4">
            <FormLabel>Customer Notes</FormLabel>
            <FormControl>
              <Textarea placeholder="Notes from or for the customer..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </ToggleSection>
  );
};
