
import React, { useState, useCallback, memo, useEffect } from "react";
import { OrdersHeader } from "./OrdersHeader";
import { OrdersContent } from "./OrdersContent";
import { CreateAppointmentDialog } from "@/components/calendar/CreateAppointmentDialog"; 
import { useOrders } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export const OrdersView = memo(function OrdersView() {
  const { orders, isLoading, clearAllOrders, refetch } = useOrders();
  
  const [view, setView] = useState<"list" | "grid">("list");
  const [openCreateOrder, setOpenCreateOrder] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  
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
    console.log("Attempting to clear all orders...");
    setIsClearing(true);
    clearAllOrders();
    
    // Set a timeout to ensure the isClearing state gets reset even if something goes wrong
    setTimeout(() => {
      setIsClearing(false);
      // Force refetch to ensure UI is updated
      refetch();
    }, 1500);
  }, [clearAllOrders, refetch]);

  // Effect to reset isClearing when orders are updated
  useEffect(() => {
    setIsClearing(false);
  }, [orders]);

  const handleRefresh = useCallback(() => {
    console.log("Manually refreshing orders...");
    toast.info("Refreshing orders list...");
    refetch();
  }, [refetch]);

  return (
    <div className="container mx-auto space-y-8">
      <OrdersHeader
        view={view}
        onChangeView={handleViewChange}
        onOpenCreateOrder={openCreateOrderDialog}
        orders={orders || []}
      />
      
      {orders && orders.length > 0 && (
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={handleClearAllOrders}
            disabled={isClearing}
            className="flex items-center gap-1"
          >
            {isClearing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Clearing...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Clear All Orders
              </>
            )}
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
