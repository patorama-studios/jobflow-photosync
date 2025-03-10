
import React from 'react';
import { FormSection, FormInput } from './OrderFormSection';

interface SchedulingSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  formData: {
    scheduledDate: string;
    scheduledTime: string;
    photographer: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function SchedulingSection({ isOpen, onToggle, formData, handleInputChange }: SchedulingSectionProps) {
  return (
    <FormSection title="Scheduling Information" isOpen={isOpen} onToggle={onToggle}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="Scheduled Date"
          name="scheduledDate"
          value={formData.scheduledDate}
          onChange={handleInputChange}
          required
          type="date"
        />
        
        <FormInput
          label="Scheduled Time"
          name="scheduledTime"
          value={formData.scheduledTime}
          onChange={handleInputChange}
          required
        />
        
        <FormInput
          label="Photographer"
          name="photographer"
          value={formData.photographer}
          onChange={handleInputChange}
        />
      </div>
    </FormSection>
  );
}
