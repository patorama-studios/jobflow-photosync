
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';

interface ResetButtonProps {
  onReset: () => void;
}

export const ResetButton = memo(function ResetButton({ onReset }: ResetButtonProps) {
  const handleReset = () => {
    onReset();
  };

  return (
    <div>
      <Button 
        onClick={handleReset}
        variant="outline"
        type="button"
      >
        Reset to Defaults
      </Button>
    </div>
  );
});
