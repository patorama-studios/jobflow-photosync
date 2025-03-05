
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { FilterActions } from './FilterActions';

interface DateRangeFilterProps {
  value: {
    from?: Date;
    to?: Date;
  };
  onChange: (value: { from?: Date; to?: Date }) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ value, onChange }) => {
  const handleReset = () => {
    onChange({ from: undefined, to: undefined });
  };

  const handleApply = () => {
    // Apply is handled automatically as user selects dates
  };

  return (
    <div className="p-2 space-y-3">
      <h3 className="font-medium text-sm mb-2">Select Date Range</h3>
      <Calendar
        mode="range"
        selected={{
          from: value.from,
          to: value.to
        }}
        onSelect={onChange}
        numberOfMonths={1}
        defaultMonth={new Date()}
      />
      <FilterActions onReset={handleReset} onApply={handleApply} />
    </div>
  );
};
