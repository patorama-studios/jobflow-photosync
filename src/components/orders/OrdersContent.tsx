
import { useState } from "react";
import { useSampleOrders } from "@/hooks/useSampleOrders";
import { Order } from "@/types";
import { useOrderExport } from "@/hooks/useOrderExport";
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

export function OrdersContent({ 
  view = "list",
  onViewChange = () => {},
}: OrdersContentProps) {
  const { orders } = useSampleOrders();
  const { mutate: exportOrders } = useOrderExport();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const handleExport = () => {
    exportOrders(orders);
  };

  // Cast to any to avoid TypeScript errors temporarily
  const ordersData: any[] = orders || [];

  const filteredOrders = ordersData.filter((order: any) => {
    const searchTerm = searchQuery.toLowerCase();
    const orderMatchesSearch =
      order.client?.toLowerCase().includes(searchTerm) ||
      order.orderNumber?.toLowerCase().includes(searchTerm) ||
      order.address?.toLowerCase().includes(searchTerm);

    const orderDate = date ? new Date(order.scheduledDate) : null;
    const selectedDate = date ? new Date(date) : null;

    const orderMatchesDate = selectedDate
      ? orderDate?.toDateString() === selectedDate?.toDateString()
      : true;

    return orderMatchesSearch && orderMatchesDate;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                onSelect={setDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("2023-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={handleExport}>Export Orders</Button>
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
          {filteredOrders.map((order: any) => (
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
          ))}
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
}
