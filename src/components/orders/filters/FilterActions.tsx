
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface FilterActionsProps {
  onReset: () => void;
  onApply: () => void;
}

export const FilterActions: React.FC<FilterActionsProps> = ({ onReset, onApply }) => {
  return (
    <>
      <Separator />
      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset Filters
        </Button>
        <Button size="sm" onClick={onApply}>
          Apply Filters
        </Button>
      </div>
    </>
  );
};
