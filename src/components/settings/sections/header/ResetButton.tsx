
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ResetButtonProps {
  onReset: () => void;
}

export const ResetButton = memo(function ResetButton({ onReset }: ResetButtonProps) {
  const { toast } = useToast();

  const handleReset = () => {
    onReset();
    toast({
      title: "Settings reset",
      description: "Header settings have been reset to default. Click Save to apply changes.",
    });
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
