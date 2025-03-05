
import React from 'react';
import { FilterActions } from './FilterActions';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface StatusFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const statusOptions = [
  { id: 'new', label: 'New Order' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' }
];

export const StatusFilter: React.FC<StatusFilterProps> = ({ value, onChange }) => {
  const handleToggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter(item => item !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const handleReset = () => {
    onChange([]);
  };

  const handleSelectAll = () => {
    onChange(statusOptions.map(option => option.id));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid gap-3">
        {statusOptions.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox 
              id={`status-${option.id}`} 
              checked={value.includes(option.id)}
              onCheckedChange={() => handleToggle(option.id)}
            />
            <Label 
              htmlFor={`status-${option.id}`}
              className="text-sm font-normal"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>

      <FilterActions 
        onReset={handleReset} 
        onApply={handleSelectAll} 
        applyText="Select All"
      />
    </div>
  );
};
