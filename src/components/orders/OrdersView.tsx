
import React, { useState, useCallback, memo } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSampleOrders } from "@/hooks/useSampleOrders";
import { OrdersHeader } from "./OrdersHeader";
import { OrdersContent } from "./OrdersContent";
import { OrderCreateForm } from "./OrderCreateForm";

export const OrdersView = memo(function OrdersView() {
  const { orders } = useSampleOrders();
  
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
    <div className="space-y-8">
      <OrdersHeader
        view={view}
        onChangeView={handleViewChange}
        onOpenCreateOrder={openCreateOrderDialog}
        orders={orders}
      />
      
      <div className="space-y-4">
        <OrdersContent 
          view={view} 
          onViewChange={handleViewChange}
        />
      </div>
      
      <Dialog open={openCreateOrder} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Order</DialogTitle>
            <DialogDescription>
              Make a new order to assign to a customer.
            </DialogDescription>
          </DialogHeader>
          <OrderCreateForm setOpen={setOpenCreateOrder} />
        </DialogContent>
      </Dialog>
    </div>
  );
});
