
import React from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OrderFiltersState } from './types';

interface FilterPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  activeFilterCount: number;
  children: React.ReactNode;
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
  isOpen,
  onOpenChange,
  activeFilterCount,
  children
}) => {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <h3 className="font-medium mb-4">Filter Orders</h3>
        <div className="space-y-4">
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
};
