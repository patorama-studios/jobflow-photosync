
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DurationSelectorProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({ 
  value, 
  onChange,
  className
}) => {
  const handleChange = (newValue: string) => {
    onChange(Number(newValue));
  };

  return (
    <Select
      value={String(value)}
      onValueChange={handleChange}
      className={className}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select duration" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="30">30 minutes</SelectItem>
        <SelectItem value="60">1 hour</SelectItem>
        <SelectItem value="90">1.5 hours</SelectItem>
        <SelectItem value="120">2 hours</SelectItem>
        <SelectItem value="180">3 hours</SelectItem>
        <SelectItem value="240">4 hours</SelectItem>
      </SelectContent>
    </Select>
  );
};
