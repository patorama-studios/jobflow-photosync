import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Camera, 
  FileText, 
  Video, 
  Plane, 
  Compass, 
  Edit, 
  ExternalLink, 
  Upload, 
  Check, 
  Clock, 
  User 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderDetailsViewProps {
  orderId?: string;
}

export function OrderDetailsView({ orderId }: OrderDetailsViewProps) {
  const { toast } = useToast();
  const [isDelivering, setIsDelivering] = useState(false);
  
  // Mock order data (would be fetched based on orderId in a real app)
  const order = {
    id: orderId || "ord-1",
    orderNumber: "ORD-001",
    address: "123 Main St, Anytown, CA",
    customer: "ABC Properties",
    shotOnDate: "2023-06-15",
    products: [
      {
        type: "photography",
        status: "in-production",
        dueDate: "2023-06-20",
        editor: "Jane Smith",
        cost: 150.00,
        deliveredItems: [],
        links: {
          raw: "https://box.com/raw-photos-123",
          completed: "https://box.com/completed-photos-123"
        }
      },
      {
        type: "floorplan",
        status: "not-started",
        dueDate: "2023-06-22",
        editor: "",
        cost: 120.00,
        deliveredItems: [],
        links: {
          raw: "",
          completed: ""
        }
      },
      {
        type: "video",
        status: "waiting-feedback",
        dueDate: "2023-06-18",
        editor: "Mike Johnson",
        cost: 250.00,
        deliveredItems: [],
        links: {
          raw: "https://box.com/raw-video-123",
          completed: "https://box.com/completed-video-123"
        }
      }
    ]
  };
  
  const handleDeliver = (productType: string) => {
    setIsDelivering(true);
    
    // Simulate deliver process
    setTimeout(() => {
      setIsDelivering(false);
      toast({
        title: "Content Delivered",
        description: `${productType} content has been delivered to the client.`,
        variant: "default",
      });
    }, 2000);
  };
  
  const getProductIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "photography":
        return <Camera className="h-5 w-5" />;
      case "floorplan":
        return <FileText className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "drone":
        return <Plane className="h-5 w-5" />; // Replaced Drone with Plane icon
      case "virtual-tour":
        return <Compass className="h-5 w-5" />;
      default:
        return <Camera className="h-5 w-5" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/production">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Production Board
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">
          Order {order.orderNumber}
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{order.address}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Customer: {order.customer} • Shot on: {new Date(order.shotOnDate).toLocaleDateString()}
              </p>
            </div>
            <Link to={`/orders/${order.id}`}>
              <Button variant="outline" size="sm">
                View Order Page
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="photography" className="w-full">
            <TabsList className="mb-6">
              {order.products.map((product) => (
                <TabsTrigger key={product.type} value={product.type} className="flex items-center gap-2">
                  {getProductIcon(product.type)}
                  {product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {order.products.map((product) => (
              <TabsContent key={product.type} value={product.type} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getProductIcon(product.type)}
                        Status & Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status:</span>
                        {getStatusBadge(product.status)}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Due Date:</span>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{new Date(product.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Editor:</span>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{product.editor || "Not assigned"}</span>
                          {product.editor && (
                            <Button variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Production Cost:</span>
                        <span>${product.cost.toFixed(2)}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        {product.links.raw && (
                          <Button variant="outline" className="w-full justify-start">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Raw Content
                          </Button>
                        )}
                        
                        {product.links.completed && (
                          <Button variant="outline" className="w-full justify-start">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Completed Content
                          </Button>
                        )}
                        
                        <Link to={`/production/upload/${order.id}?product=${product.type}`} className="w-full">
                          <Button className="w-full justify-start">
                            <Upload className="h-4 w-4 mr-2" />
                            Start Upload Process
                          </Button>
                        </Link>
                        
                        {product.status === "in-production" && (
                          <Button 
                            variant="default" 
                            className="w-full justify-start"
                            onClick={() => handleDeliver(product.type)}
                            disabled={isDelivering}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {isDelivering ? "Delivering..." : "Deliver Content"}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Delivered Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.deliveredItems.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Content previews would go here */}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No content has been delivered yet.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
