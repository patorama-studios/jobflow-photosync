
import React from 'react';
import { FormSection, FormTextarea } from './OrderFormSection';

interface NotesSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  formData: {
    customerNotes: string;
    internalNotes: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function NotesSection({ isOpen, onToggle, formData, handleInputChange }: NotesSectionProps) {
  return (
    <FormSection title="Order Notes" isOpen={isOpen} onToggle={onToggle}>
      <div className="space-y-4">
        <FormTextarea
          label="Customer Notes"
          name="customerNotes"
          value={formData.customerNotes}
          onChange={handleInputChange}
        />
        
        <FormTextarea
          label="Internal Notes"
          name="internalNotes"
          value={formData.internalNotes}
          onChange={handleInputChange}
        />
      </div>
    </FormSection>
  );
}
