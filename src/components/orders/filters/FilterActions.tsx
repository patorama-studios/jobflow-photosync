
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface FilterActionsProps {
  onReset: () => void;
  onApply: () => void;
  hideApply?: boolean;
  applyText?: string;
}

export const FilterActions: React.FC<FilterActionsProps> = ({ 
  onReset, 
  onApply, 
  hideApply = false,
  applyText = "Apply Filters" 
}) => {
  return (
    <>
      <Separator />
      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onReset}>
          Reset Filters
        </Button>
        {!hideApply && (
          <Button size="sm" onClick={onApply}>
            {applyText}
          </Button>
        )}
      </div>
    </>
  );
};
