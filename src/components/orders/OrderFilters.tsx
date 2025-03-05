
import React, { useState } from 'react';
import { FilterPopover } from './filters/FilterPopover';
import { DateRangeFilter } from './filters/DateRangeFilter';
import { StatusFilter } from './filters/StatusFilter';
import { SortDirectionFilter } from './filters/SortDirectionFilter';
import { FilterActions } from './filters/FilterActions';
import { 
  CalendarRange, 
  Check, 
  ChevronDown, 
  Filter, 
  SortAsc, 
  SortDesc, 
  X 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OrderFiltersState } from './OrderFilters';

// Define OrderFiltersState type properly with optional date fields
export interface OrderFiltersState {
  status: string[];
  sortDirection: 'asc' | 'desc';
  dateRange: {
    from?: Date | undefined;
    to?: Date | undefined;
  };
}

interface OrderFiltersProps {
  onFiltersChange: (filters: OrderFiltersState) => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({ onFiltersChange }) => {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [status, setStatus] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
    onFiltersChange({
      status,
      sortDirection,
      dateRange: range
    });
  };

  const handleStatusChange = (newStatus: string[]) => {
    setStatus(newStatus);
    onFiltersChange({
      status: newStatus,
      sortDirection,
      dateRange
    });
  };

  const handleSortDirectionChange = (direction: 'asc' | 'desc') => {
    setSortDirection(direction);
    onFiltersChange({
      status,
      sortDirection: direction,
      dateRange
    });
  };

  const handleResetFilters = () => {
    setDateRange({});
    setStatus([]);
    setSortDirection('desc');
    onFiltersChange({
      status: [],
      sortDirection: 'desc',
      dateRange: {}
    });
  };

  const hasActiveFilters = status.length > 0 || dateRange.from || dateRange.to;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterPopover
        triggerContent={
          <div className="flex items-center gap-1">
            <CalendarRange className="h-4 w-4" />
            <span>Date Range</span>
            {(dateRange.from || dateRange.to) && <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full" />}
            <ChevronDown className="h-3 w-3 opacity-50" />
          </div>
        }
      >
        <DateRangeFilter 
          value={dateRange} 
          onChange={handleDateRangeChange} 
        />
      </FilterPopover>

      <FilterPopover
        triggerContent={
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>Status</span>
            {status.length > 0 && (
              <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center">
                {status.length}
              </Badge>
            )}
            <ChevronDown className="h-3 w-3 opacity-50" />
          </div>
        }
      >
        <StatusFilter 
          value={status} 
          onChange={handleStatusChange} 
        />
      </FilterPopover>

      <FilterPopover
        triggerContent={
          <div className="flex items-center gap-1">
            {sortDirection === 'asc' ? 
              <SortAsc className="h-4 w-4" /> : 
              <SortDesc className="h-4 w-4" />
            }
            <span>Sort Order</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </div>
        }
      >
        <SortDirectionFilter 
          value={sortDirection} 
          onChange={handleSortDirectionChange} 
        />
      </FilterPopover>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 gap-1 px-2 text-destructive"
          onClick={handleResetFilters}
        >
          <X className="h-3 w-3" />
          Clear Filters
        </Button>
      )}
    </div>
  );
};
