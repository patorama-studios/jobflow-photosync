
import React from 'react';
import { Order } from '@/types/order-types';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

interface OrderRowProps {
  order: Order;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onViewDetails: () => void;
}

export function OrderRow({ order, isExpanded, onToggleExpand, onViewDetails }: OrderRowProps) {
  // Format date if it exists, otherwise show placeholder
  const formattedDate = order.scheduledDate 
    ? format(new Date(order.scheduledDate), "MMM d, yyyy")
    : "Not scheduled";
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return "bg-green-100 text-green-800";
      case 'scheduled':
        return "bg-blue-100 text-blue-800";
      case 'pending':
        return "bg-amber-100 text-amber-800";
      case 'cancelled':
      case 'canceled':
        return "bg-red-100 text-red-800";
      case 'in_progress':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <TableRow className={cn("cursor-pointer", isExpanded && "bg-muted/50")}>
        <TableCell className="font-medium">
          {order.orderNumber || order.order_number || `#${order.id.toString().slice(0, 8)}`}
        </TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span>{formattedDate}</span>
            <span className="text-xs text-muted-foreground">{order.scheduledTime || order.scheduled_time}</span>
          </div>
        </TableCell>
        <TableCell>
          {order.client || order.customerName || "Unknown Client"}
        </TableCell>
        <TableCell className="max-w-[200px] truncate">
          {order.address || order.propertyAddress || "No address provided"}
        </TableCell>
        <TableCell>
          <Badge variant="outline" className={cn("capitalize", getStatusColor(order.status))}>
            {order.status}
          </Badge>
        </TableCell>
        <TableCell>
          ${order.price || 0}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onToggleExpand} className="h-8 w-8">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onViewDetails} className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onViewDetails}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>
      
      {isExpanded && (
        <TableRow className="bg-muted/30">
          <TableCell colSpan={7} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Order Details</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Property Type:</dt>
                  <dd>{order.propertyType || order.property_type || "N/A"}</dd>
                  
                  <dt className="text-muted-foreground">Square Feet:</dt>
                  <dd>{order.squareFeet || order.square_feet || "N/A"}</dd>
                  
                  <dt className="text-muted-foreground">Package:</dt>
                  <dd>{order.package || "N/A"}</dd>
                  
                  <dt className="text-muted-foreground">Photographer:</dt>
                  <dd>{order.photographer || "Not assigned"}</dd>
                </dl>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Client Details</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-muted-foreground">Email:</dt>
                  <dd>{order.clientEmail || order.client_email || "N/A"}</dd>
                  
                  <dt className="text-muted-foreground">Phone:</dt>
                  <dd>{order.clientPhone || order.client_phone || "N/A"}</dd>
                  
                  <dt className="text-muted-foreground">Notes:</dt>
                  <dd className="truncate max-w-[200px]">{order.notes || "No notes"}</dd>
                </dl>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button size="sm" onClick={onViewDetails}>View Full Details</Button>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
