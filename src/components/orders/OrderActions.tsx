
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash, Loader2 } from "lucide-react";
import { DeleteOrderDialog } from "./details/DeleteOrderDialog";
import { deleteOrder } from "@/services/order-service";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface OrderActionsProps {
  orderId: string;
  orderNumber?: string;
  onOrderDeleted?: () => void;
}

export function OrderActions({ orderId, orderNumber, onOrderDeleted }: OrderActionsProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/orders/${orderId}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/orders/${orderId}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async (): Promise<void> => {
    if (isDeleting) return; // Prevent multiple deletion requests
    
    try {
      setIsDeleting(true);
      const { success, error } = await deleteOrder(orderId);
      
      if (error) {
        toast.error(`Failed to delete order: ${error}`);
        return;
      } 
      
      if (success) {
        toast.success("Order deleted successfully");
        
        // Invalidate orders query cache
        await queryClient.invalidateQueries({ queryKey: ['orders'] });
        
        // If we're on a specific order's page, navigate back to orders
        if (window.location.pathname.includes(orderId)) {
          navigate('/orders', { replace: true });
        }
        
        // Call the callback if provided
        if (onOrderDeleted) {
          onOrderDeleted();
        }
      }
    } catch (err) {
      console.error("Error during delete operation:", err);
      toast.error("An unexpected error occurred while deleting the order");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting}>
            <span className="sr-only">Open menu</span>
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive" 
            onClick={handleDelete}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteOrderDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirmDelete={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}
