
import React, { useState } from 'react';
import { Order } from '@/types/order-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { OrderRow } from './OrderRow';
import { OrdersEmptyState } from './OrdersEmptyState';
import { Pagination } from './Pagination';

interface AllOrdersListProps {
  orders: Order[];
  isLoading: boolean;
}

export function AllOrdersList({ orders, isLoading }: AllOrdersListProps) {
  const navigate = useNavigate();
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string | number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 30;
  
  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  
  const toggleOrderExpanded = (orderId: string | number) => {
    const newExpandedOrderIds = new Set(expandedOrderIds);
    if (newExpandedOrderIds.has(orderId)) {
      newExpandedOrderIds.delete(orderId);
    } else {
      newExpandedOrderIds.add(orderId);
    }
    setExpandedOrderIds(newExpandedOrderIds);
  };
  
  const navigateToOrder = (orderId: string | number) => {
    navigate(`/orders/${orderId}`);
  };
  
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (orders.length === 0) {
    return <OrdersEmptyState />;
  }

  return (
    <div>
      <Table className="border-collapse">
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentOrders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              isExpanded={expandedOrderIds.has(order.id)}
              onToggleExpand={() => toggleOrderExpanded(order.id)}
              onViewDetails={() => navigateToOrder(order.id)}
            />
          ))}
        </TableBody>
      </Table>
      
      {orders.length > ordersPerPage && (
        <div className="flex justify-between items-center px-4 py-2 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, orders.length)} of {orders.length} orders
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
