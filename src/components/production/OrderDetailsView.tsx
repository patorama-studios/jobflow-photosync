
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  User,
  Download,
  Lock,
  Unlock,
  CreditCard,
  AlertTriangle,
  PlusCircle,
  MinusCircle,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderDetailsViewProps {
  orderId?: string;
}

export function OrderDetailsView({ orderId }: OrderDetailsViewProps) {
  const { toast } = useToast();
  const [isDelivering, setIsDelivering] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [contentLocked, setContentLocked] = useState(true);
  
  // Mock order data (would be fetched based on orderId in a real app)
  const order = {
    id: orderId || "ord-1",
    orderNumber: "ORD-001",
    address: "123 Main St, Anytown, CA",
    customer: "ABC Properties",
    customerCompany: "XYZ Real Estate",
    shotOnDate: "2023-06-15",
    totalAmount: 520,
    amountPaid: 0,
    paymentStatus: "unpaid",
    paymentDueDate: "2023-07-15",
    paymentTerms: "30days",
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

  const outstandingAmount = order.totalAmount - order.amountPaid;
  
  const handleProcessPayment = () => {
    // In a real app, this would call your payment processing API
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive",
      });
      return;
    }
    
    // Mock processing payment
    setTimeout(() => {
      setPaymentCompleted(true);
      setContentLocked(false);
      toast({
        title: "Payment Processed",
        description: `Payment of $${amount.toFixed(2)} has been processed successfully.`,
      });
      
      // Close dialog after a moment
      setTimeout(() => {
        setShowPaymentDialog(false);
        setPaymentAmount("");
        setPaymentCompleted(false);
      }, 2000);
    }, 1500);
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
  
  const handleToggleContentLock = () => {
    setContentLocked(!contentLocked);
    toast({
      title: contentLocked ? "Content Unlocked" : "Content Locked", 
      description: contentLocked 
        ? "Client can now download content regardless of payment status." 
        : "Content will require payment before download.",
    });
  };
  
  const handleDownloadAttempt = (productType: string) => {
    if (contentLocked && order.paymentStatus === "unpaid") {
      toast({
        title: "Content Locked",
        description: "This content cannot be downloaded until payment is received.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Downloading Content",
        description: `${productType} content is being prepared for download.`,
      });
      // In a real app, this would trigger the actual download
    }
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
        <Badge 
          variant={contentLocked ? "destructive" : "success"}
          className="ml-auto"
        >
          {contentLocked ? (
            <>
              <Lock className="h-3 w-3 mr-1" />
              Content Locked
            </>
          ) : (
            <>
              <Unlock className="h-3 w-3 mr-1" />
              Content Unlocked
            </>
          )}
        </Badge>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{order.address}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Client: {order.customer} • Company: {order.customerCompany} • Shot on: {new Date(order.shotOnDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleToggleContentLock}
              >
                {contentLocked ? (
                  <>
                    <Unlock className="h-4 w-4 mr-2" />
                    Unlock Content
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Lock Content
                  </>
                )}
              </Button>
              <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Process Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Process Payment</DialogTitle>
                    <DialogDescription>
                      Record a payment for order {order.orderNumber}.
                      {paymentCompleted && (
                        <div className="mt-2 p-2 bg-green-50 text-green-700 rounded-md flex items-center">
                          <Check className="h-4 w-4 mr-2" />
                          Payment successful! Content is now unlocked.
                        </div>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="payment-amount">Payment Amount ($)</Label>
                        <Input
                          id="payment-amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          placeholder={outstandingAmount.toString()}
                          disabled={paymentCompleted}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <p className="text-sm text-muted-foreground">Outstanding Balance:</p>
                        <p className="font-medium">${outstandingAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPaymentDialog(false)}
                      disabled={paymentCompleted}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleProcessPayment}
                      disabled={paymentCompleted || !paymentAmount}
                    >
                      {paymentCompleted ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <CreditCard className="h-4 w-4 mr-2" />
                      )}
                      {paymentCompleted ? "Paid" : "Process Payment"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Link to={`/orders/${order.id}`}>
                <Button variant="outline" size="sm">
                  View Order Page
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center justify-center p-4 bg-white rounded-md shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                    <p className="text-xl font-bold">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white rounded-md shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                    <p className="text-xl font-bold text-green-600">${order.amountPaid.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white rounded-md shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Outstanding</p>
                    <p className="text-xl font-bold text-amber-600">${outstandingAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-4 bg-white rounded-md shadow-sm">
                    <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                    <div className="flex items-center">
                      <p className="text-xl font-bold">{new Date(order.paymentDueDate).toLocaleDateString()}</p>
                      <Badge className="ml-2">{order.paymentTerms}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
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
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Content Lock Status:</span>
                        <Badge 
                          variant={contentLocked ? "destructive" : "success"}
                        >
                          {contentLocked ? (
                            <>
                              <Lock className="h-3 w-3 mr-1" />
                              Locked
                            </>
                          ) : (
                            <>
                              <Unlock className="h-3 w-3 mr-1" />
                              Unlocked
                            </>
                          )}
                        </Badge>
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
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => handleDownloadAttempt(product.type)}
                          >
                            {contentLocked && order.paymentStatus === "unpaid" ? (
                              <Lock className="h-4 w-4 mr-2" />
                            ) : (
                              <Download className="h-4 w-4 mr-2" />
                            )}
                            {contentLocked && order.paymentStatus === "unpaid" 
                              ? "Content Locked (Requires Payment)" 
                              : "Download Completed Content"
                            }
                          </Button>
                        )}
                        
                        <Link to={`/production/upload/${order.id}?product=${product.type}`} className="w-full">
                          <Button className="w-full justify-start">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload New Content
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
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Delivered Content</CardTitle>
                      {contentLocked && order.paymentStatus === "unpaid" && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-700 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Payment Required to Download
                        </Badge>
                      )}
                    </div>
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
