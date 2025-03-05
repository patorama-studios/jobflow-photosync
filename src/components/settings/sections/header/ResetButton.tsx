
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useHeaderSettings } from '@/hooks/useHeaderSettings';

export function ResetButton() {
  const { toast } = useToast();
  const { updateSettings } = useHeaderSettings();

  const handleReset = () => {
    updateSettings({
      color: '#000000',
      height: 65,
      logoUrl: '/lovable-uploads/77021d72-0ef2-4178-8ddf-8a3c742c0974.png',
      showCompanyName: false
    });
    toast({
      title: "Settings reset",
      description: "Header settings have been reset to default",
    });
  };

  return (
    <div className="pt-4">
      <Button 
        onClick={handleReset}
        variant="outline"
        className="w-full"
      >
        Reset to Defaults
      </Button>
    </div>
  );
}
