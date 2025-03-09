
import React, { useState, useCallback, memo } from "react";
import { OrdersHeader } from "./OrdersHeader";
import { OrdersContent } from "./OrdersContent";
import { CreateAppointmentDialog } from "@/components/calendar/CreateAppointmentDialog"; 
import { useOrders } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export const OrdersView = memo(function OrdersView() {
  const { orders, isLoading, clearAllOrders } = useOrders();
  
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

  const handleClearAllOrders = useCallback(() => {
    clearAllOrders();
  }, [clearAllOrders]);

  return (
    <div className="container mx-auto space-y-8">
      <OrdersHeader
        view={view}
        onChangeView={handleViewChange}
        onOpenCreateOrder={openCreateOrderDialog}
        orders={orders || []}
      />
      
      {orders && orders.length > 0 && (
        <div className="flex justify-end">
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleClearAllOrders}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            Clear All Orders
          </Button>
        </div>
      )}
      
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
