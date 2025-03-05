import React, { useState } from "react";
import { useOrders } from "@/hooks/use-orders";
import { OrderSearch } from "./OrderSearch";
import { OrderFilters } from "./OrderFilters";
import { OrderStats } from "./OrderStats";
import { OrdersContent } from "./OrdersContent";
import { OrdersHeader } from "./OrdersHeader";
import { CreateOrderDialog } from "./CreateOrderDialog";
import { useToast } from "@/hooks/use-toast";

export function OrdersView() {
  const { 
    orders, 
    isLoading, 
    filters,
  } = useOrders();
  const [openFilters, setOpenFilters] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const { toast } = useToast();

  const handleCreateOrder = () => {
    setIsCreateDialogOpen(true);
  };

  const filteredOrders = orders.filter((order) => {
    const query = filters.query.toLowerCase();
    const matchesQuery = 
      order.customer.toLowerCase().includes(query) ||
      order.orderNumber.toLowerCase().includes(query);

    const matchesStatus = 
      !filters.status || filters.status === "all" || order.status === filters.status;

    const matchesDateRange = 
      !filters.dateRange ||
      (order.createdAt >= filters.dateRange.from && order.createdAt <= filters.dateRange.to);

    return matchesQuery && matchesStatus && matchesDateRange;
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();

    return filters.sortDirection === "asc" ? dateA - dateB : dateB - dateA;
  });

  const handleStatusChange = (newStatus: string) => {
    filters.setStatus(newStatus);
  };
  
  return (
    <div className="space-y-6">
      <OrdersHeader 
        onCreateOrder={handleCreateOrder}  
      />
      
      <div className="space-y-4">
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
          <OrderSearch query={filters.query} onQueryChange={filters.setQuery} className="w-full lg:w-80" />
          <OrderFilters 
            openFilters={openFilters}
            onOpenFiltersChange={setOpenFilters}
            status={filters.status as string} // Ensure status is a string, not string[]
            onStatusChange={handleStatusChange}
            dateRange={filters.dateRange}
            onDateRangeChange={filters.setDateRange}
            sortDirection={filters.sortDirection}
            onSortDirectionChange={filters.setSortDirection}
            onResetFilters={filters.resetFilters}
          />
        </div>
        
        <OrderStats orders={filteredOrders} />
      </div>
      
      <OrdersContent 
        orders={filteredOrders} 
        isLoading={isLoading}
        viewType={viewType}
        onViewTypeChange={setViewType}
      />
      
      <CreateOrderDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  );
}
