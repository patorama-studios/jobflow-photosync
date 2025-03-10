
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Order } from "@/types/order-types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface OrderFiltersProps {
  orders: Order[];
  onFiltersChange: (filteredOrders: Order[]) => void;
}

export function OrderFilters({ orders, onFiltersChange }: OrderFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [status, setStatus] = useState<string>("");
  
  // Extract unique statuses from orders for the dropdown
  const statuses = Array.from(new Set(orders.map(order => order.status))).filter(Boolean);
  
  // Apply filters whenever filter values change
  useEffect(() => {
    const filteredOrders = orders.filter(order => {
      // Apply search filter
      const matchesSearch = searchQuery 
        ? (order.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           order.address?.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      
      // Apply date range filter
      const orderDate = order.scheduledDate ? new Date(order.scheduledDate) : null;
      const matchesDateRange = 
        (!dateRange.from || !orderDate) ? true : orderDate >= dateRange.from &&
        (!dateRange.to || !orderDate) ? true : orderDate <= dateRange.to;
      
      // Apply status filter
      const matchesStatus = status ? order.status === status : true;
      
      return matchesSearch && matchesDateRange && matchesStatus;
    });
    
    onFiltersChange(filteredOrders);
  }, [searchQuery, dateRange, status, orders, onFiltersChange]);
  
  const clearFilters = () => {
    setSearchQuery("");
    setDateRange({ from: undefined, to: undefined });
    setStatus("");
  };
  
  const hasActiveFilters = searchQuery || dateRange.from || dateRange.to || status;

  return (
    <div className="border-b p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders by client, number, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange.from && !dateRange.to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from || dateRange.to ? (
                  <>
                    {dateRange.from ? format(dateRange.from, "LLL dd, y") : "Start"} 
                    {" — "}
                    {dateRange.to ? format(dateRange.to, "LLL dd, y") : "End"}
                  </>
                ) : (
                  <span>Date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange as any}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
