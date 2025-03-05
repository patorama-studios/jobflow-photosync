
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface DateRangeFilterProps {
  label: string;
  dateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  onDateRangeChange: (dateRange: { from?: Date; to?: Date } | undefined) => void;
}

export const formatDateRange = (range: { from?: Date, to?: Date } | undefined) => {
  if (!range) return '';
  
  if (range.from && range.to) {
    return `${format(range.from, 'MMM d, yyyy')} - ${format(range.to, 'MMM d, yyyy')}`;
  } else if (range.from) {
    return `From ${format(range.from, 'MMM d, yyyy')}`;
  } else if (range.to) {
    return `Until ${format(range.to, 'MMM d, yyyy')}`;
  }
  
  return '';
};

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ 
  label, 
  dateRange, 
  onDateRangeChange 
}) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal text-xs h-8"
            >
              <CalendarIcon className="mr-2 h-3 w-3" />
              {dateRange?.from ? (
                format(dateRange.from, 'PPP')
              ) : (
                <span>From</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateRange?.from}
              onSelect={(date) =>
                onDateRangeChange({
                  ...dateRange,
                  from: date
                })
              }
            />
          </PopoverContent>
        </Popover>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal text-xs h-8"
            >
              <CalendarIcon className="mr-2 h-3 w-3" />
              {dateRange?.to ? (
                format(dateRange.to, 'PPP')
              ) : (
                <span>To</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dateRange?.to}
              onSelect={(date) =>
                onDateRangeChange({
                  ...dateRange,
                  to: date
                })
              }
            />
          </PopoverContent>
        </Popover>
      </div>
      {(dateRange?.from || dateRange?.to) && (
        <div className="flex items-center mt-1">
          <Badge variant="outline" className="text-xs py-0 h-5">
            {formatDateRange(dateRange)}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-3 w-3 ml-1 p-0"
              onClick={() => onDateRangeChange(undefined)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}
    </div>
  );
};
