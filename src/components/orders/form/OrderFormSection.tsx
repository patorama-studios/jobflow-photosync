
import React from 'react';
import { ToggleSection } from '@/components/calendar/appointment/components/ToggleSection';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function FormSection({ title, isOpen, onToggle, children }: FormSectionProps) {
  return (
    <ToggleSection title={title} isOpen={isOpen} onToggle={onToggle}>
      {children}
    </ToggleSection>
  );
}

export function FormInput({ 
  label, 
  name, 
  value, 
  onChange, 
  required = false, 
  type = "text" 
}: { 
  label: string; 
  name: string; 
  value: string | number; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  required?: boolean; 
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name}>{label}{required && '*'}</label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value.toString()}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

export function FormTextarea({ 
  label, 
  name, 
  value, 
  onChange
}: { 
  label: string; 
  name: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name}>{label}</label>
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="min-h-[80px]"
      />
    </div>
  );
}

export function FormSelect({ 
  label, 
  name, 
  value, 
  onChange, 
  options,
  required = false
}: { 
  label: string; 
  name: string; 
  value: string; 
  onChange: (value: string) => void; 
  options: {value: string; label: string}[];
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name}>{label}{required && '*'}</label>
      <Select
        value={value}
        onValueChange={(value) => onChange(name, value)}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
