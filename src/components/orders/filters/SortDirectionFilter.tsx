
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

interface SortDirectionFilterProps {
  sortDirection: 'asc' | 'desc';
  onSortDirectionChange: (direction: 'asc' | 'desc') => void;
}

export const SortDirectionFilter: React.FC<SortDirectionFilterProps> = ({
  sortDirection,
  onSortDirectionChange
}) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">Sort Direction</label>
      <Button
        variant="outline"
        className="w-full justify-start text-xs h-8"
        onClick={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
      >
        <ArrowUpDown className="mr-2 h-3 w-3" />
        {sortDirection === 'asc' ? 'Oldest First' : 'Newest First'}
      </Button>
    </div>
  );
};
