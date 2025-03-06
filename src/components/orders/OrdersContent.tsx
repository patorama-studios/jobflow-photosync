
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSampleOrders } from "@/hooks/useSampleOrders";

import OrdersTable from "./table/OrdersTable";
import OrdersSearchBar from "./filters/OrdersSearchBar";
import { useOrdersFiltering } from "./hooks/useOrdersFiltering";

type OrdersContentProps = {
  view?: "list" | "grid";
  onViewChange?: (view: "list" | "grid") => void;
};

export const OrdersContent = memo(function OrdersContent({ 
  view = "list",
  onViewChange = () => {},
}: OrdersContentProps) {
  const { orders } = useSampleOrders();
  const navigate = useNavigate();
  
  const { 
    date, 
    searchQuery, 
    filteredOrders, 
    handleSearchChange, 
    handleDateSelect 
  } = useOrdersFiltering(orders);

  const handleRowClick = useCallback((orderId: string | number) => {
    navigate(`/orders/${orderId}`);
  }, [navigate]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
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
