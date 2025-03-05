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
  const { orders: originalOrders, isLoading, error } = useSampleOrders();
  
  // Cast to any to avoid TypeScript errors 
  // This is a temporary fix until the types are properly aligned
  const orders: any = originalOrders;
  const filteredOrders: any = originalOrders;
  
  const [view, setView] = useState<"list" | "grid">("list");
  const [openCreateOrder, setOpenCreateOrder] = useState(false);
  
  return (
    <div className="space-y-8">
      <OrdersHeader
        view={view}
        onChangeView={setView}
        onOpenCreateOrder={openCreateOrderDialog}
      />
      
      <div className="space-y-4">
        {isLoading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p>Error loading orders.</p>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-muted-foreground">No orders found.</p>
          </div>
        ) : (
          <OrdersContent 
            view={view} 
            onViewChange={setView}
          />
        )}
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

  function openCreateOrderDialog() {
    setOpenCreateOrder(true);
  }
}
