
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import { formatDate } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';

const statusColorMap: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30",
  in_progress: "bg-orange-500/20 text-orange-500 hover:bg-orange-500/30",
  completed: "bg-green-500/20 text-green-500 hover:bg-green-500/30",
  cancelled: "bg-red-500/20 text-red-500 hover:bg-red-500/30",
  late: "bg-purple-500/20 text-purple-500 hover:bg-purple-500/30",
  paid: "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30",
};

export const OrderTable = ({ orders = [] }: { orders: any[] }) => {
  const navigate = useNavigate();

  const handleViewOrder = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };

  const convertToString = (value: string | number): string => {
    return value?.toString() || '';
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={convertToString(order.id)}>
                <TableCell className="font-medium">{convertToString(order.id)}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{formatDate(order.orderDate)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColorMap[order.status || "new"]}>
                    {order.status?.replace("_", " ") || "New"}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[240px] truncate">
                  {order.propertyAddress}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleViewOrder(convertToString(order.id))}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Order</DropdownMenuItem>
                        <DropdownMenuItem>Change Status</DropdownMenuItem>
                        <DropdownMenuItem>Download Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
