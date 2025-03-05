
import React, { useState } from "react";
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
import { Order } from "@/types";

export function OrdersView() {
  const { orders } = useSampleOrders();
  
  const [view, setView] = useState<"list" | "grid">("list");
  const [openCreateOrder, setOpenCreateOrder] = useState(false);
  
  function openCreateOrderDialog() {
    setOpenCreateOrder(true);
  }

  return (
    <div className="space-y-8">
      <OrdersHeader
        view={view}
        onChangeView={setView}
        onOpenCreateOrder={openCreateOrderDialog}
      />
      
      <div className="space-y-4">
        <OrdersContent 
          view={view} 
          onViewChange={setView}
        />
      </div>
      
      <Dialog open={openCreateOrder} onOpenChange={setOpenCreateOrder}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={openCreateOrderDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        </DialogTrigger>
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
}
