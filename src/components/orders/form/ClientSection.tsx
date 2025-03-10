
import React from 'react';
import { FormSection, FormInput } from './OrderFormSection';

interface ClientSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  formData: {
    client: string;
    clientEmail: string;
    clientPhone: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ClientSection({ isOpen, onToggle, formData, handleInputChange }: ClientSectionProps) {
  return (
    <FormSection title="Client Information" isOpen={isOpen} onToggle={onToggle}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Client Name"
          name="client"
          value={formData.client}
          onChange={handleInputChange}
          required
        />
        
        <FormInput
          label="Client Email"
          name="clientEmail"
          value={formData.clientEmail}
          onChange={handleInputChange}
          required
          type="email"
        />
        
        <FormInput
          label="Client Phone"
          name="clientPhone"
          value={formData.clientPhone}
          onChange={handleInputChange}
        />
      </div>
    </FormSection>
  );
}
