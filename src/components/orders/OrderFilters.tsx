
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DateRangeFilter } from './filters/DateRangeFilter';
import { StatusFilter } from './filters/StatusFilter';
import { SortDirectionFilter } from './filters/SortDirectionFilter';
import { FilterActions } from './filters/FilterActions';
import { FilterPopover } from './filters/FilterPopover';
import { OrderFiltersState } from './filters/types';

interface OrderFiltersProps {
  onFiltersChange: (filters: OrderFiltersState) => void;
}

const ORDER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Not Scheduled' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'completed', label: 'Completed' }
];

const PAYMENT_STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'pending', label: 'Pending' }
];

export const OrderFilters: React.FC<OrderFiltersProps> = ({ onFiltersChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<OrderFiltersState>({
    sortDirection: 'desc',
  });
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  
  const handleFilterChange = (newFilters: Partial<OrderFiltersState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Count active filters
    let count = 0;
    if (updatedFilters.dateRangeCreated?.from || updatedFilters.dateRangeCreated?.to) count++;
    if (updatedFilters.appointmentDateRange?.from || updatedFilters.appointmentDateRange?.to) count++;
    if (updatedFilters.orderStatus) count++;
    if (updatedFilters.paymentStatus) count++;
    if (updatedFilters.orderItems) count++;
    
    setActiveFilterCount(count);
    onFiltersChange(updatedFilters);
  };
  
  const resetFilters = () => {
    const resetState: OrderFiltersState = {
      sortDirection: 'desc',
    };
    setFilters(resetState);
    setActiveFilterCount(0);
    onFiltersChange(resetState);
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2">
        <FilterPopover
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          activeFilterCount={activeFilterCount}
        >
          {/* Date Range Created */}
          <DateRangeFilter
            label="Date Range Created"
            dateRange={filters.dateRangeCreated}
            onDateRangeChange={(dateRange) => 
              handleFilterChange({ dateRangeCreated: dateRange })
            }
          />
          
          {/* Appointment Date Range */}
          <DateRangeFilter
            label="Appointment Date Range"
            dateRange={filters.appointmentDateRange}
            onDateRangeChange={(dateRange) => 
              handleFilterChange({ appointmentDateRange: dateRange })
            }
          />
          
          {/* Order Status */}
          <StatusFilter
            label="Order Status"
            status={filters.orderStatus}
            onStatusChange={(status) => 
              handleFilterChange({ orderStatus: status })
            }
            options={ORDER_STATUS_OPTIONS}
          />
          
          {/* Payment Status */}
          <StatusFilter
            label="Payment Status"
            status={filters.paymentStatus}
            onStatusChange={(status) => 
              handleFilterChange({ paymentStatus: status })
            }
            options={PAYMENT_STATUS_OPTIONS}
          />
          
          {/* Sort Direction */}
          <SortDirectionFilter 
            sortDirection={filters.sortDirection} 
            onSortDirectionChange={(direction) => 
              handleFilterChange({ sortDirection: direction })
            }
          />
          
          {/* Filter Actions */}
          <FilterActions
            onReset={resetFilters}
            onApply={() => setIsOpen(false)}
          />
        </FilterPopover>
        
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export { type OrderFiltersState } from './filters/types';
