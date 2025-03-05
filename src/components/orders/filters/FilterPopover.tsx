
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

export interface FilterPopoverProps {
  children: React.ReactNode;
  triggerContent: React.ReactNode;
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({ 
  children, 
  triggerContent 
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          {triggerContent}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        {children}
      </PopoverContent>
    </Popover>
  );
};
