
import React from 'react';
import { FilterActions } from './FilterActions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { SortAsc, SortDesc } from 'lucide-react';

export interface SortDirectionFilterProps {
  value: 'asc' | 'desc';
  onChange: (value: 'asc' | 'desc') => void;
}

export const SortDirectionFilter: React.FC<SortDirectionFilterProps> = ({ 
  value, 
  onChange 
}) => {
  const handleReset = () => {
    onChange('desc');
  };

  return (
    <div className="p-4 space-y-4">
      <RadioGroup 
        value={value} 
        onValueChange={onChange as (value: string) => void}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="asc" id="sort-asc" />
          <Label htmlFor="sort-asc" className="flex items-center gap-2">
            <SortAsc className="h-4 w-4" />
            Ascending (A-Z, Oldest First)
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="desc" id="sort-desc" />
          <Label htmlFor="sort-desc" className="flex items-center gap-2">
            <SortDesc className="h-4 w-4" />
            Descending (Z-A, Newest First)
          </Label>
        </div>
      </RadioGroup>

      <FilterActions 
        onReset={handleReset} 
        onApply={() => {}} 
        hideApply={true}
      />
    </div>
  );
};
