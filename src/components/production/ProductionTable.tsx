
import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Eye, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

type ProductStatus = "not-started" | "in-production" | "waiting-feedback" | "delivered";

interface ProductTypeStatus {
  type: "photography" | "floorplan" | "video" | "drone" | "virtual-tour";
  status: ProductStatus;
  dueDate: string;
  editor?: string;
}

interface ProductionOrder {
  id: string;
  orderNumber: string;
  address: string;
  customer: string;
  shotOnDate: string;
  productTypes: ProductTypeStatus[];
  status: "waiting-uploads" | "in-production" | "change-request" | "delivered" | "overdue";
}

// Mock data for the production table
const MOCK_ORDERS: ProductionOrder[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-001",
    address: "123 Main St, Anytown, CA",
    customer: "ABC Properties",
    shotOnDate: "2023-06-15",
    status: "overdue",
    productTypes: [
      { type: "photography", status: "in-production", dueDate: "2023-06-20", editor: "Jane Smith" },
      { type: "floorplan", status: "not-started", dueDate: "2023-06-22" },
      { type: "video", status: "waiting-feedback", dueDate: "2023-06-18", editor: "Mike Johnson" }
    ]
  },
  {
    id: "ord-2",
    orderNumber: "ORD-002",
    address: "456 Oak Ave, Sometown, NY",
    customer: "XYZ Realty",
    shotOnDate: "2023-06-18",
    status: "in-production",
    productTypes: [
      { type: "photography", status: "delivered", dueDate: "2023-06-25", editor: "Alex Wong" },
      { type: "drone", status: "in-production", dueDate: "2023-06-27", editor: "Sarah Lee" }
    ]
  },
  {
    id: "ord-3",
    orderNumber: "ORD-003",
    address: "789 Pine Blvd, Othertown, TX",
    customer: "123 Properties",
    shotOnDate: "2023-06-12",
    status: "waiting-uploads",
    productTypes: [
      { type: "photography", status: "not-started", dueDate: "2023-06-30" },
      { type: "floorplan", status: "not-started", dueDate: "2023-07-02" },
      { type: "virtual-tour", status: "not-started", dueDate: "2023-07-05" }
    ]
  },
  {
    id: "ord-4",
    orderNumber: "ORD-004",
    address: "101 Maple Dr, Newtown, FL",
    customer: "Premier Homes",
    shotOnDate: "2023-06-10",
    status: "delivered",
    productTypes: [
      { type: "photography", status: "delivered", dueDate: "2023-06-17", editor: "Chris Brown" },
      { type: "video", status: "delivered", dueDate: "2023-06-19", editor: "Lisa Garcia" },
      { type: "drone", status: "delivered", dueDate: "2023-06-20", editor: "David Kim" }
    ]
  },
  {
    id: "ord-5",
    orderNumber: "ORD-005",
    address: "202 Cedar Ln, Lasttown, WA",
    customer: "Urban Realty",
    shotOnDate: "2023-06-20",
    status: "change-request",
    productTypes: [
      { type: "photography", status: "waiting-feedback", dueDate: "2023-06-28", editor: "Emma Wilson" },
      { type: "floorplan", status: "delivered", dueDate: "2023-06-29", editor: "Tom Jackson" },
      { type: "virtual-tour", status: "in-production", dueDate: "2023-07-01", editor: "Olivia Martinez" }
    ]
  }
];

// Helper function to calculate days remaining
const getDaysRemaining = (dueDate: string): number => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function to get status badge color
const getStatusBadge = (status: ProductStatus) => {
  switch (status) {
    case "not-started":
      return <Badge variant="outline" className="bg-slate-200 text-slate-700">Not Started</Badge>;
    case "in-production":
      return <Badge variant="outline" className="bg-blue-100 text-blue-700">In Production</Badge>;
    case "waiting-feedback":
      return <Badge variant="outline" className="bg-amber-100 text-amber-700">Waiting Feedback</Badge>;
    case "delivered":
      return <Badge variant="outline" className="bg-green-100 text-green-700">Delivered</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Helper function to get countdown component
const getCountdown = (dueDate: string, status: ProductStatus) => {
  if (status === "delivered") {
    return <Badge variant="outline" className="bg-green-100 text-green-700">Delivered</Badge>;
  }
  
  const daysRemaining = getDaysRemaining(dueDate);
  
  return (
    <div className="flex items-center">
      <Clock className={`h-4 w-4 mr-2 ${
        daysRemaining < 0 ? "text-red-500" : 
        daysRemaining <= 2 ? "text-amber-500" : 
        "text-green-500"
      }`} />
      <span className={
        daysRemaining < 0 ? "text-red-500 font-medium" : 
        daysRemaining <= 2 ? "text-amber-500 font-medium" : 
        "text-green-500"
      }>
        {daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` : 
        daysRemaining === 0 ? "Due today" :
        `${daysRemaining} days left`}
      </span>
    </div>
  );
};

// Helper to get status light component
const getStatusLight = (status: ProductStatus) => {
  let bgColor;
  switch (status) {
    case "not-started":
      bgColor = "bg-slate-400";
      break;
    case "in-production":
      bgColor = "bg-blue-500";
      break;
    case "waiting-feedback":
      bgColor = "bg-amber-500";
      break;
    case "delivered":
      bgColor = "bg-green-500";
      break;
    default:
      bgColor = "bg-slate-400";
  }
  
  return (
    <div className="flex items-center">
      <div className={`h-3 w-3 rounded-full ${bgColor} mr-2`}></div>
      <span className="text-sm">{status === "not-started" ? "Not Started" : 
             status === "in-production" ? "In Production" : 
             status === "waiting-feedback" ? "Waiting Feedback" : 
             "Delivered"}</span>
    </div>
  );
};

export function ProductionTable({ statusFilter = "all" }: { statusFilter?: string }) {
  const [filteredOrders, setFilteredOrders] = useState<ProductionOrder[]>(MOCK_ORDERS);
  
  useEffect(() => {
    if (statusFilter === "all") {
      // Sort to show overdue first
      setFilteredOrders([...MOCK_ORDERS].sort((a, b) => 
        a.status === "overdue" ? -1 : b.status === "overdue" ? 1 : 0
      ));
    } else {
      setFilteredOrders(MOCK_ORDERS.filter(order => order.status === statusFilter));
    }
  }, [statusFilter]);

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Order #</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="w-[120px]">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Shot Date
              </div>
            </TableHead>
            <TableHead>Photography</TableHead>
            <TableHead>Floor Plan</TableHead>
            <TableHead>Video</TableHead>
            <TableHead className="w-[80px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                No orders found with the selected filter.
              </TableCell>
            </TableRow>
          ) : (
            filteredOrders.map((order) => (
              <TableRow key={order.id} className={order.status === "overdue" ? "bg-red-50" : ""}>
                <TableCell>
                  <div className="font-medium">{order.orderNumber}</div>
                </TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{new Date(order.shotOnDate).toLocaleDateString()}</TableCell>
                
                {/* Photography */}
                <TableCell>
                  {order.productTypes.find(p => p.type === "photography") ? (
                    <div className="space-y-1">
                      {getStatusLight(order.productTypes.find(p => p.type === "photography")!.status)}
                      {getCountdown(
                        order.productTypes.find(p => p.type === "photography")!.dueDate,
                        order.productTypes.find(p => p.type === "photography")!.status
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
                </TableCell>
                
                {/* Floor Plan */}
                <TableCell>
                  {order.productTypes.find(p => p.type === "floorplan") ? (
                    <div className="space-y-1">
                      {getStatusLight(order.productTypes.find(p => p.type === "floorplan")!.status)}
                      {getCountdown(
                        order.productTypes.find(p => p.type === "floorplan")!.dueDate,
                        order.productTypes.find(p => p.type === "floorplan")!.status
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
                </TableCell>
                
                {/* Video */}
                <TableCell>
                  {order.productTypes.find(p => p.type === "video") ? (
                    <div className="space-y-1">
                      {getStatusLight(order.productTypes.find(p => p.type === "video")!.status)}
                      {getCountdown(
                        order.productTypes.find(p => p.type === "video")!.dueDate,
                        order.productTypes.find(p => p.type === "video")!.status
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">N/A</span>
                  )}
                </TableCell>
                
                <TableCell className="text-right">
                  <Link to={`/production/order/${order.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
