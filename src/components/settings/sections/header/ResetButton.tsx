
import React, { useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useHeaderSettings } from '@/hooks/useHeaderSettings';

// Default settings object - move outside component to prevent recreation
const DEFAULT_SETTINGS = {
  color: '#000000',
  height: 65,
  logoUrl: '/lovable-uploads/77021d72-0ef2-4178-8ddf-8a3c742c0974.png',
  showCompanyName: false
};

export const ResetButton = memo(function ResetButton() {
  const { toast } = useToast();
  const { updateSettings } = useHeaderSettings();

  const handleReset = useCallback(() => {
    updateSettings(DEFAULT_SETTINGS);
    toast({
      title: "Settings reset",
      description: "Header settings have been reset to default",
    });
  }, [updateSettings, toast]);

  return (
    <div className="pt-4">
      <Button 
        onClick={handleReset}
        variant="outline"
        className="w-full"
        type="button"
      >
        Reset to Defaults
      </Button>
    </div>
  );
});
