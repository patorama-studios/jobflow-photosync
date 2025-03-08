
import React, { useState, useCallback, memo } from "react";
import { OrdersHeader } from "./OrdersHeader";
import { OrdersContent } from "./OrdersContent";
import { CreateAppointmentDialog } from "@/components/calendar/CreateAppointmentDialog"; 
import { useOrders } from "@/hooks/use-orders";

export const OrdersView = memo(function OrdersView() {
  const { orders, isLoading } = useOrders();
  
  const [view, setView] = useState<"list" | "grid">("list");
  const [openCreateOrder, setOpenCreateOrder] = useState(false);
  
  const handleViewChange = useCallback((newView: "list" | "grid") => {
    setView(newView);
  }, []);
  
  const openCreateOrderDialog = useCallback(() => {
    setOpenCreateOrder(true);
  }, []);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setOpenCreateOrder(open);
  }, []);

  return (
    <div className="container mx-auto space-y-8">
      <OrdersHeader
        view={view}
        onChangeView={handleViewChange}
        onOpenCreateOrder={openCreateOrderDialog}
        orders={orders || []}
      />
      
      <div className="space-y-4">
        <OrdersContent 
          view={view} 
          onViewChange={handleViewChange}
          isLoading={isLoading}
        />
      </div>
      
      <CreateAppointmentDialog
        isOpen={openCreateOrder}
        onClose={() => setOpenCreateOrder(false)}
        selectedDate={new Date()}
      />
    </div>
  );
});
