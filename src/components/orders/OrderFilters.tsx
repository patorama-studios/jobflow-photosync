
import React, { useState } from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  Filter, 
  Calendar as CalendarIcon, 
  ArrowUpDown,
  Check,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export interface OrderFiltersState {
  dateRangeCreated?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  appointmentDateRange?: {
    from: Date | undefined;
    to: Date | undefined;
  };
  orderStatus?: string;
  paymentStatus?: string;
  orderItems?: string;
  sortDirection: 'asc' | 'desc';
}

interface OrderFiltersProps {
  onFiltersChange: (filters: OrderFiltersState) => void;
}

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
  
  const formatDateRange = (range: { from?: Date, to?: Date } | undefined) => {
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
  
  return (
    <div className="mb-4">
      <div className="flex items-center space-x-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
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
              {/* Created Date Range */}
              <div>
                <label className="text-sm font-medium mb-1 block">Date Range Created</label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal text-xs h-8"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {filters.dateRangeCreated?.from ? (
                          format(filters.dateRangeCreated.from, 'PPP')
                        ) : (
                          <span>From</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRangeCreated?.from}
                        onSelect={(date) =>
                          handleFilterChange({
                            dateRangeCreated: {
                              ...filters.dateRangeCreated,
                              from: date
                            }
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
                        {filters.dateRangeCreated?.to ? (
                          format(filters.dateRangeCreated.to, 'PPP')
                        ) : (
                          <span>To</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dateRangeCreated?.to}
                        onSelect={(date) =>
                          handleFilterChange({
                            dateRangeCreated: {
                              ...filters.dateRangeCreated,
                              to: date
                            }
                          })
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {(filters.dateRangeCreated?.from || filters.dateRangeCreated?.to) && (
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="text-xs py-0 h-5">
                      {formatDateRange(filters.dateRangeCreated)}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-3 w-3 ml-1 p-0"
                        onClick={() => handleFilterChange({ dateRangeCreated: undefined })}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Appointment Date Range */}
              <div>
                <label className="text-sm font-medium mb-1 block">Appointment Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal text-xs h-8"
                      >
                        <CalendarIcon className="mr-2 h-3 w-3" />
                        {filters.appointmentDateRange?.from ? (
                          format(filters.appointmentDateRange.from, 'PPP')
                        ) : (
                          <span>From</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.appointmentDateRange?.from}
                        onSelect={(date) =>
                          handleFilterChange({
                            appointmentDateRange: {
                              ...filters.appointmentDateRange,
                              from: date
                            }
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
                        {filters.appointmentDateRange?.to ? (
                          format(filters.appointmentDateRange.to, 'PPP')
                        ) : (
                          <span>To</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.appointmentDateRange?.to}
                        onSelect={(date) =>
                          handleFilterChange({
                            appointmentDateRange: {
                              ...filters.appointmentDateRange,
                              to: date
                            }
                          })
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                {(filters.appointmentDateRange?.from || filters.appointmentDateRange?.to) && (
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="text-xs py-0 h-5">
                      {formatDateRange(filters.appointmentDateRange)}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-3 w-3 ml-1 p-0"
                        onClick={() => handleFilterChange({ appointmentDateRange: undefined })}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Order Status */}
              <div>
                <label className="text-sm font-medium mb-1 block">Order Status</label>
                <Select
                  value={filters.orderStatus}
                  onValueChange={(value) => handleFilterChange({ orderStatus: value })}
                >
                  <SelectTrigger className="w-full text-xs h-8">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Not Scheduled</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                {filters.orderStatus && filters.orderStatus !== 'all' && (
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="text-xs py-0 h-5">
                      Status: {filters.orderStatus}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-3 w-3 ml-1 p-0"
                        onClick={() => handleFilterChange({ orderStatus: undefined })}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Payment Status */}
              <div>
                <label className="text-sm font-medium mb-1 block">Payment Status</label>
                <Select
                  value={filters.paymentStatus}
                  onValueChange={(value) => handleFilterChange({ paymentStatus: value })}
                >
                  <SelectTrigger className="w-full text-xs h-8">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                {filters.paymentStatus && filters.paymentStatus !== 'all' && (
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="text-xs py-0 h-5">
                      Payment: {filters.paymentStatus}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-3 w-3 ml-1 p-0"
                        onClick={() => handleFilterChange({ paymentStatus: undefined })}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  </div>
                )}
              </div>
              
              {/* Sort Direction */}
              <div>
                <label className="text-sm font-medium mb-1 block">Sort Direction</label>
                <Button
                  variant="outline"
                  className="w-full justify-start text-xs h-8"
                  onClick={() =>
                    handleFilterChange({
                      sortDirection: filters.sortDirection === 'asc' ? 'desc' : 'asc'
                    })
                  }
                >
                  <ArrowUpDown className="mr-2 h-3 w-3" />
                  {filters.sortDirection === 'asc' ? 'Oldest First' : 'Newest First'}
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Reset Filters
                </Button>
                <Button size="sm" onClick={() => setIsOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
