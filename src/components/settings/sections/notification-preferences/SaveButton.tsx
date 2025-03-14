
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export const SaveButton: React.FC = () => {
  return (
    <div className="flex justify-end">
      <Button 
        onClick={() => {
          toast.success("Notification preferences saved successfully");
        }}
      >
        <Save className="h-4 w-4 mr-2" />
        Save Changes
      </Button>
    </div>
  );
};
