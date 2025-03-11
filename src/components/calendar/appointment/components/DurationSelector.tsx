
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface DurationSelectorProps {
  selectedDuration: number;
  onDurationChange: (duration: number) => void;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  selectedDuration,
  onDurationChange
}) => {
  const durations = [
    { value: 30, label: '30 min' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' }
  ];

  return (
    <div className="space-y-2 mt-4">
      <Label>Appointment Duration</Label>
      <RadioGroup
        value={selectedDuration.toString()}
        onValueChange={(value) => onDurationChange(parseInt(value))}
        className="flex flex-wrap gap-2 mt-1"
      >
        {durations.map((duration) => (
          <div key={duration.value} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={duration.value.toString()} 
              id={`duration-${duration.value}`} 
            />
            <Label 
              htmlFor={`duration-${duration.value}`}
              className="cursor-pointer"
            >
              {duration.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
