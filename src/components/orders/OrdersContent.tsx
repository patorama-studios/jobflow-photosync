
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

type OrdersContentProps = {
  view?: "list" | "grid";
  onViewChange?: (view: "list" | "grid") => void;
};

export const OrdersContent = memo(({ 
  view = "list",
  onViewChange = () => {},
}: OrdersContentProps) => {
  const { orders } = useSampleOrders();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleDateSelect = useCallback((newDate: Date | undefined) => {
    setDate(newDate);
  }, []);

  // Memoize filtered orders to avoid recalculation on every render
  const filteredOrders = useMemo(() => {
    const ordersData: any[] = orders || [];
    
    return ordersData.filter((order: any) => {
      const searchTerm = searchQuery.toLowerCase();
      const orderMatchesSearch =
        (order.client?.toLowerCase().includes(searchTerm) || false) ||
        (order.orderNumber?.toLowerCase().includes(searchTerm) || false) ||
        (order.address?.toLowerCase().includes(searchTerm) || false);

      const orderDate = order.scheduledDate ? new Date(order.scheduledDate) : null;
      const selectedDate = date ? new Date(date) : null;

      const orderMatchesDate = selectedDate && orderDate
        ? orderDate.toDateString() === selectedDate.toDateString()
        : true;

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
        <TableBody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber || order.id}</TableCell>
                <TableCell>{order.client || order.customer || "Unknown"}</TableCell>
                <TableCell>{order.scheduledDate || order.date || "N/A"}</TableCell>
                <TableCell>${order.price || order.amount || 0}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{order.status || "pending"}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <OrderActions orderId={order.id} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6} className="text-right">
              Total {filteredOrders.length} orders
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
});

OrdersContent.displayName = 'OrdersContent';
