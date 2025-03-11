
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
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ];

  return (
    <div className="space-y-3">
      <Label>Duration</Label>
      <RadioGroup 
        defaultValue={selectedDuration.toString()} 
        className="flex flex-wrap gap-2" 
        onValueChange={(value) => onDurationChange(parseInt(value, 10))}
      >
        {durations.map((duration) => (
          <div key={duration.value} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={duration.value.toString()} 
              id={`duration-${duration.value}`}
              checked={selectedDuration === duration.value}
            />
            <Label htmlFor={`duration-${duration.value}`} className="cursor-pointer">
              {duration.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};
