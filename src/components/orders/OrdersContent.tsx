
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import OrdersTable from "./table/OrdersTable";
import OrdersSearchBar from "./filters/OrdersSearchBar";
import { useOrdersFiltering } from "./hooks/useOrdersFiltering";
import { useOrders } from "@/hooks/use-orders";
import { Skeleton } from "@/components/ui/skeleton";

type OrdersContentProps = {
  view?: "list" | "grid";
  onViewChange?: (view: "list" | "grid") => void;
  isLoading?: boolean;
};

export const OrdersContent = memo(function OrdersContent({ 
  view = "list",
  onViewChange = () => {},
  isLoading = false,
}: OrdersContentProps) {
  const { orders } = useOrders();
  const navigate = useNavigate();
  
  const { 
    date, 
    searchQuery, 
    filteredOrders, 
    handleSearchChange, 
    handleDateSelect 
  } = useOrdersFiltering(orders || []);

  const handleRowClick = useCallback((orderId: string | number) => {
    // Fix: Changed from '/order/' to '/orders/' to match the route configuration
    navigate(`/orders/${orderId}`);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-full rounded-md bg-muted/50 animate-pulse"></div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 w-full rounded-md bg-muted/50 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-md border">
      <div className="p-4 border-b">
        <OrdersSearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          date={date}
          onDateSelect={handleDateSelect}
        />
      </div>

      <OrdersTable 
        orders={filteredOrders} 
        onRowClick={handleRowClick} 
      />
    </div>
  );
});
