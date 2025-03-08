
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';

interface NotificationSelectorProps {
  // Add props if needed for controlling notification methods
}

export const NotificationSelector: React.FC<NotificationSelectorProps> = () => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notifyClient">Client Notification</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left">
            Email
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search notification method..." />
            <CommandList>
              <CommandEmpty>No method found.</CommandEmpty>
              <CommandGroup>
                <CommandItem onSelect={() => {}}>No notification</CommandItem>
                <CommandItem onSelect={() => {}}>Email</CommandItem>
                <CommandItem onSelect={() => {}}>SMS</CommandItem>
                <CommandItem onSelect={() => {}}>Email & SMS</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
