
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
        orders={orders}
        filteredOrders={filteredOrders}
        isFiltered={filters.query !== "" || filters.status !== "all" || !!filters.dateRange.from}
        onNewOrder={handleCreateOrder}
      />
      
      <div className="space-y-4">
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
          <OrderSearch 
            orders={orders} 
            onSearchResults={(results) => {
              // We're not directly setting search results,
              // but updating the query which triggers filtering
              // in the parent component
            }} 
            className="w-full lg:w-80" 
          />
          <OrderFilters 
            onFiltersChange={(newFilters) => {
              // Map the filters to our hook's setters
              if (newFilters.status) {
                filters.setStatus(newFilters.status[0] || 'all');
              }
              if (newFilters.dateRange) {
                filters.setDateRange(newFilters.dateRange);
              }
              if (newFilters.sortDirection) {
                filters.setSortDirection(newFilters.sortDirection);
              }
            }}
          />
        </div>
        
        <OrderStats orders={filteredOrders} />
      </div>
      
      <OrdersContent 
        orders={filteredOrders}
        todayOrders={filteredOrders.filter(order => 
          new Date(order.createdAt).toDateString() === new Date().toDateString()
        )}
        thisWeekOrders={filteredOrders.filter(order => {
          const orderDate = new Date(order.createdAt);
          const today = new Date();
          const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
          const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
          return orderDate >= weekStart && orderDate <= weekEnd;
        })}
        filteredRemainingOrders={filteredOrders.filter(order => {
          const orderDate = new Date(order.createdAt);
          const today = new Date();
          const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
          return orderDate < weekStart;
        })}
        statusFilter={filters.status}
        isFiltered={filters.query !== "" || filters.status !== "all" || !!filters.dateRange.from}
        totalFilteredCount={filteredOrders.length}
        onSearchResults={() => {}}
        onFilterChange={() => {}}
        onStatusChange={handleStatusChange}
      />
      
      <CreateOrderDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  );
}
