
import { useState, useCallback, useMemo, memo } from "react";
import { useSampleOrders } from "@/hooks/useSampleOrders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { OrderActions } from "./OrderActions";
import { useNavigate } from "react-router-dom";
import { Order } from "@/types/order-types";

type OrdersContentProps = {
  view?: "list" | "grid";
  onViewChange?: (view: "list" | "grid") => void;
};

// Create separate memoized components for better performance
const TableHeader = memo(() => (
  <TableHead>
    <TableRow>
      <TableHead>Order ID</TableHead>
      <TableHead>Customer</TableHead>
      <TableHead>Date</TableHead>
      <TableHead>Amount</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Actions</TableHead>
    </TableRow>
  </TableHead>
));

TableHeader.displayName = 'TableHeader';

const TableFooterComponent = memo(({ count }: { count: number }) => (
  <TableFooter>
    <TableRow>
      <TableCell colSpan={6} className="text-right">
        Total {count} orders
      </TableCell>
    </TableRow>
  </TableFooter>
));

TableFooterComponent.displayName = 'TableFooterComponent';

// Memoized table row component to prevent unnecessary re-renders
const OrderRow = memo(({ 
  order, 
  onRowClick 
}: { 
  order: Order, 
  onRowClick: (id: string | number) => void 
}) => (
  <TableRow 
    className="cursor-pointer hover:bg-accent/50"
    onClick={() => onRowClick(order.id)}
  >
    <TableCell>{order.orderNumber || order.id}</TableCell>
    <TableCell>{order.client || order.customer || "Unknown"}</TableCell>
    <TableCell>{order.scheduledDate || order.date || "N/A"}</TableCell>
    <TableCell>${order.price || order.amount || 0}</TableCell>
    <TableCell>
      <Badge variant="secondary">{order.status || "pending"}</Badge>
    </TableCell>
    <TableCell 
      className="text-right"
      onClick={(e) => e.stopPropagation()} // Prevent row click when clicking on actions
    >
      <OrderActions orderId={order.id} />
    </TableCell>
  </TableRow>
));

OrderRow.displayName = 'OrderRow';

// Main component with performance optimizations
export const OrdersContent = memo(function OrdersContent({ 
  view = "list",
  onViewChange = () => {},
}: OrdersContentProps) {
  const { orders } = useSampleOrders();
  const navigate = useNavigate();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  // Use useCallback for all event handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleDateSelect = useCallback((newDate: Date | undefined) => {
    setDate(newDate);
  }, []);

  const handleRowClick = useCallback((orderId: string | number) => {
    navigate(`/orders/${orderId}`);
  }, [navigate]);

  // Memoize filtered orders to avoid recalculation on every render
  const filteredOrders = useMemo(() => {
    const ordersData = orders || [];
    if (!searchQuery && !date) return ordersData;
    
    const searchTermLower = searchQuery.toLowerCase();
    
    return ordersData.filter((order: any) => {
      // Skip search filtering if no search term
      const orderMatchesSearch = !searchQuery || 
        (order.client?.toLowerCase().includes(searchTermLower) || false) ||
        (order.orderNumber?.toLowerCase().includes(searchTermLower) || false) ||
        (order.address?.toLowerCase().includes(searchTermLower) || false);

      // Skip date filtering if no date selected
      if (!date) return orderMatchesSearch;
      
      const orderDate = order.scheduledDate ? new Date(order.scheduledDate) : null;
      const selectedDate = date;

      const orderMatchesDate = !selectedDate || !orderDate ? true :
        orderDate.toDateString() === selectedDate.toDateString();

      return orderMatchesSearch && orderMatchesDate;
    });
  }, [orders, searchQuery, date]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="max-w-[250px]"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date > new Date() || date < new Date("2023-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Table>
        <TableCaption>A list of your recent orders.</TableCaption>
        <TableHeader />
        <TableBody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order: any) => (
              <OrderRow 
                key={order.id} 
                order={order} 
                onRowClick={handleRowClick} 
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooterComponent count={filteredOrders.length} />
      </Table>
    </div>
  );
});
