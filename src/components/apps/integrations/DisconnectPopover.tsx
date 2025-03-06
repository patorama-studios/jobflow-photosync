
import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trash2 } from 'lucide-react';

interface DisconnectPopoverProps {
  name: string;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  handleDisconnect: () => void;
}

export function DisconnectPopover({ 
  name, 
  isDeleteOpen, 
  setIsDeleteOpen, 
  handleDisconnect 
}: DisconnectPopoverProps) {
  return (
    <Popover open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Disconnect Integration</h4>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to disconnect {name}? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
