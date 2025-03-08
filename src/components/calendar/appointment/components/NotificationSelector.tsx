
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';

interface NotificationSelectorProps {
  onNotificationMethodChange?: (method: string) => void;
  defaultMethod?: string;
}

export const NotificationSelector: React.FC<NotificationSelectorProps> = ({ 
  onNotificationMethodChange,
  defaultMethod = "Email" 
}) => {
  const [selectedMethod, setSelectedMethod] = useState(defaultMethod);

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
    if (onNotificationMethodChange) {
      onNotificationMethodChange(method);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="notifyClient">Client Notification</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left">
            {selectedMethod}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search notification method..." />
            <CommandList>
              <CommandEmpty>No method found.</CommandEmpty>
              <CommandGroup>
                <CommandItem onSelect={() => handleSelectMethod("No notification")}>No notification</CommandItem>
                <CommandItem onSelect={() => handleSelectMethod("Email")}>Email</CommandItem>
                <CommandItem onSelect={() => handleSelectMethod("SMS")}>SMS</CommandItem>
                <CommandItem onSelect={() => handleSelectMethod("Email & SMS")}>Email & SMS</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
