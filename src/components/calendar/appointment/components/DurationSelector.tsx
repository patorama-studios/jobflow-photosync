
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface DurationSelectorProps {
  selectedDuration: number;
  onDurationChange: (duration: number) => void;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({ 
  selectedDuration, 
  onDurationChange 
}) => {
  const handleChange = (value: string) => {
    onDurationChange(parseInt(value));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="duration">Duration</Label>
      <Select
        value={selectedDuration.toString()}
        onValueChange={handleChange}
      >
        <SelectTrigger id="duration">
          <SelectValue placeholder="Select duration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="30">30 minutes</SelectItem>
          <SelectItem value="60">1 hour</SelectItem>
          <SelectItem value="90">1.5 hours</SelectItem>
          <SelectItem value="120">2 hours</SelectItem>
          <SelectItem value="150">2.5 hours</SelectItem>
          <SelectItem value="180">3 hours</SelectItem>
          <SelectItem value="240">4 hours</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
