
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { PageTransition } from '@/components/layout/PageTransition';
import { useSampleOrders } from '@/hooks/useSampleOrders';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { InvoiceItems, ContractorPayout, InvoiceItem } from '@/components/orders/InvoiceItems';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Home, 
  DollarSign,
  FileText,
  Image,
  Upload,
  Tag,
  Edit,
  X,
  CheckCircle,
  Lock,
  Mail,
  Activity,
  Download,
  ExternalLink,
  Truck,
  Users
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders } = useSampleOrders();
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [orderFulfilled, setOrderFulfilled] = useState(false);
  const [contentLocked, setContentLocked] = useState(false);
  
  // Contractor payout state
  const [customPayoutRate, setCustomPayoutRate] = useState<number | undefined>(undefined);
  const [showCustomPayoutInput, setShowCustomPayoutInput] = useState(false);
  const [contractorEditor, setContractorEditor] = useState('');
  
  // New dialog states
  const [editAppointmentOpen, setEditAppointmentOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deliverDialogOpen, setDeliverDialogOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  // Invoice items state
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  
  const order = orders.find(o => o.id === Number(orderId));

  useEffect(() => {
    // Initialize invoice items when order is loaded
    if (order) {
      setInvoiceItems([
        {
          id: '1',
          name: 'Professional Photography',
          quantity: 1,
          price: order.price,
          type: 'service'
        }
      ]);
      
      // Initialize custom payout rate with order's rate if available
      if (order.photographerPayoutRate) {
        setCustomPayoutRate(order.photographerPayoutRate);
      }
    }
  }, [order]);
  
  // Handle custom payout rate change
  const handleCustomPayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCustomPayoutRate(isNaN(value) ? undefined : value);
  };
  
  // Save custom payout rate
  const saveCustomPayoutRate = () => {
    toast({
      title: "Payout Rate Updated",
      description: `Custom payout rate of $${customPayoutRate} has been saved`,
    });
    setShowCustomPayoutInput(false);
  };
  
  if (!order) {
    return (
      <PageTransition>
        <div className="container mx-auto py-6">
          <div className="flex items-center mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 mr-4"
              onClick={() => navigate('/orders')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Button>
            <h1 className="text-3xl font-semibold">Order Not Found</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p>The order you're looking for doesn't exist or has been removed.</p>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleDeliverOrder = () => {
    setDeliverDialogOpen(true);
  };

  const confirmDeliverOrder = () => {
    toast({
      title: "Order Delivered",
      description: `Delivery email sent to ${recipientEmail || 'client'}`,
    });
    setDeliverDialogOpen(false);
  };

  const handleEditAppointment = () => {
    setEditAppointmentOpen(true);
  };

  const handleRescheduleAppointment = () => {
    setRescheduleDialogOpen(true);
  };

  const handleCancelAppointment = () => {
    setCancelDialogOpen(true);
  };

  const confirmCancelAppointment = () => {
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been cancelled successfully",
    });
    setCancelDialogOpen(false);
  };

  const activityLog = [
    { 
      type: 'email', 
      description: 'Order confirmation email sent', 
      timestamp: new Date(new Date().getTime() - 3600000 * 24 * 3).toISOString(),
      user: 'System' 
    },
    { 
      type: 'update', 
      description: 'Order status changed to scheduled', 
      timestamp: new Date(new Date().getTime() - 3600000 * 24 * 2).toISOString(),
      user: 'Alex Johnson' 
    },
    { 
      type: 'update', 
      description: 'Photographer assigned', 
      timestamp: new Date(new Date().getTime() - 3600000 * 24).toISOString(),
      user: 'Sarah Manager' 
    }
  ];

  return (
    <PageTransition>
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 mr-4"
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
          <h1 className="text-3xl font-semibold">Order {order.orderNumber}</h1>
          <Badge 
            className="ml-4"
            variant={
              order.status === 'completed' ? 'default' :
              order.status === 'scheduled' ? 'secondary' : 'outline'
            }
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
          
          <div className="ml-auto">
            <Link to={`/delivery/${orderId}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Content Delivery
              </Button>
            </Link>
          </div>
        </div>

        {/* Tag Management */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Tags:</span>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Input 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tag"
              className="w-32 h-8 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <Button size="sm" variant="outline" onClick={handleAddTag}>
              Add
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings & Activity</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab Content */}
          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Main Content - 70% */}
              <div className="lg:col-span-7 space-y-6">
                {/* Invoicing Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Invoicing
                    </CardTitle>
                    <CardDescription>Manage invoice items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InvoiceItems items={invoiceItems} onItemsChange={setInvoiceItems} />
                  </CardContent>
                </Card>

                {/* Appointment Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Appointment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium">Date & Time</h3>
                        <p className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(order.scheduledDate), 'MMMM d, yyyy')}
                        </p>
                        <p className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {order.scheduledTime}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium">Location</h3>
                        <p className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {order.address}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Assigned Photographer</h3>
                      <p className="flex items-center gap-1 text-muted-foreground">
                        <User className="h-4 w-4" />
                        {order.photographer}
                      </p>
                    </div>
                    
                    <div className="pt-2 flex flex-wrap gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={handleEditAppointment}
                      >
                        <Edit className="h-4 w-4" />
                        Edit Appointment
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={handleRescheduleAppointment}
                      >
                        <Calendar className="h-4 w-4" />
                        Reschedule
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1 text-destructive"
                        onClick={handleCancelAppointment}
                      >
                        <X className="h-4 w-4" />
                        Cancel Appointment
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Upload Media Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="h-5 w-5" />
                      Media
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {order.mediaUploaded ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {order.mediaLinks?.map((_, index) => (
                            <div key={index} className="border rounded-md overflow-hidden">
                              <div className="aspect-video bg-muted flex items-center justify-center">
                                <p className="text-muted-foreground">Media Preview {index + 1}</p>
                              </div>
                              <div className="p-2 flex justify-between items-center">
                                <span className="text-sm">Image {index + 1}</span>
                                <Button size="sm" variant="ghost">Download</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-center gap-1"
                          onClick={() => setMediaDialogOpen(true)}
                        >
                          <Image className="h-4 w-4" />
                          View All Media
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8 space-y-4">
                        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-medium">No media uploaded yet</h3>
                          <p className="text-muted-foreground text-sm">Upload photos or videos for this order</p>
                        </div>
                        <Button>Upload Media</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Custom Fields */}
                {order.customFields && Object.keys(order.customFields).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Custom Fields</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(order.customFields).map(([key, value]) => (
                          <div key={key}>
                            <h3 className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                            <p className="text-muted-foreground">{value as string}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Contractor Payout Section - New Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Contractor Payment
                    </CardTitle>
                    <CardDescription>Manage contractor payout details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium">Assigned Contractor</h3>
                          <div className="flex items-center gap-3 mt-2">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="" alt={order.photographer || 'Contractor'} />
                              <AvatarFallback>
                                {order.photographer?.split(' ').map(part => part[0]).join('').slice(0, 2) || 'CN'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{order.photographer || 'Not assigned'}</p>
                              <p className="text-sm text-muted-foreground">Photographer</p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium">Editor</h3>
                          <div className="flex items-center mt-2">
                            <Input
                              placeholder="Enter editor name"
                              value={contractorEditor}
                              onChange={(e) => setContractorEditor(e.target.value)}
                              className="w-full max-w-xs"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Payout Rate</h3>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-1"
                              onClick={() => setShowCustomPayoutInput(!showCustomPayoutInput)}
                            >
                              <Edit className="h-4 w-4" />
                              {showCustomPayoutInput ? 'Cancel' : 'Override Rate'}
                            </Button>
                          </div>
                          
                          {showCustomPayoutInput ? (
                            <div className="mt-2 space-y-3">
                              <div className="space-y-2">
                                <Label htmlFor="custom-payout">Custom Payout Amount ($)</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    id="custom-payout"
                                    type="number"
                                    placeholder="Enter amount"
                                    value={customPayoutRate !== undefined ? customPayoutRate : ''}
                                    onChange={handleCustomPayoutChange}
                                    className="w-full max-w-xs"
                                  />
                                  <Button onClick={saveCustomPayoutRate}>Save</Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-2">
                              <div className="bg-muted p-4 rounded-md">
                                <p className="text-lg font-semibold flex items-center">
                                  <DollarSign className="h-5 w-5 mr-1" />
                                  {customPayoutRate !== undefined ? customPayoutRate.toFixed(2) : (order.photographerPayoutRate?.toFixed(2) || 'Not set')}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {customPayoutRate !== undefined ? 'Custom rate' : 'Default rate'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h3 className="font-medium">Total Payout</h3>
                          <div className="bg-muted p-4 rounded-md mt-2">
                            <ContractorPayout 
                              items={invoiceItems} 
                              payoutRate={customPayoutRate !== undefined ? customPayoutRate : (order.photographerPayoutRate || 0)} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium">Payout Notes</h3>
                      <Textarea 
                        placeholder="Add notes about this payment..." 
                        className="mt-2"
                      />
                      <div className="mt-3 flex justify-end">
                        <Button variant="default" size="sm">Save Notes</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - 30% */}
              <div className="lg:col-span-3 space-y-6">
                {/* Order Actions - Moved above Customer Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full flex items-center gap-2 justify-center" 
                      onClick={handleDeliverOrder}
                    >
                      <Truck className="h-4 w-4" />
                      Deliver Order
                    </Button>
                    
                    <Link to={`/files/${orderId}`} className="w-full">
                      <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
                        <Download className="h-4 w-4" />
                        Download Files
                      </Button>
                    </Link>
                    
                    <Link to={`/property-website/${orderId}`} className="w-full">
                      <Button variant="outline" className="w-full flex items-center gap-2 justify-center">
                        <ExternalLink className="h-4 w-4" />
                        View Property Website
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Customer Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" alt={order.client} />
                        <AvatarFallback>
                          {order.client.split(' ').map(part => part[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{order.client.split(' - ')[0]}</h3>
                        <p className="text-sm text-muted-foreground">{order.client.split(' - ')[1] || 'Client'}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Contact Details</h3>
                      <p className="text-sm text-muted-foreground">Email: {order.clientEmail || 'client@example.com'}</p>
                      <p className="text-sm text-muted-foreground">Phone: {order.clientPhone || '(555) 123-4567'}</p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-sm font-medium flex items-center gap-1">
                        <FileText className="h-4 w-4" /> 
                        Internal Notes
                      </h3>
                      {order.internalNotes ? (
                        <p className="text-sm text-muted-foreground">{order.internalNotes}</p>
                      ) : (
                        <div className="pt-1">
                          <Textarea 
                            placeholder="Add internal notes about this client..." 
                            className="h-20 text-sm"
                          />
                          <Button size="sm" className="mt-2">Save Notes</Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium">Order Number</h3>
                      <p className="text-sm">{order.orderNumber}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Property Type</h3>
                      <p className="text-sm">{order.propertyType} ({order.squareFeet} sq ft)</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Created Date</h3>
                      <p className="text-sm">{format(new Date(order.scheduledDate), 'MMMM d, yyyy')}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Settings & Activity Tab Content */}
          <TabsContent value="settings" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Settings - 70% */}
              <div className="lg:col-span-7 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Order Fulfillment</h3>
                        <p className="text-sm text-muted-foreground">Mark this order as fulfilled when complete</p>
                      </div>
                      <Button 
                        variant={orderFulfilled ? "default" : "outline"}
                        className="flex items-center gap-1"
                        onClick={() => setOrderFulfilled(!orderFulfilled)}
                      >
                        <CheckCircle className="h-4 w-4" />
                        {orderFulfilled ? "Fulfilled" : "Mark as Fulfilled"}
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Content Locking</h3>
                        <p className="text-sm text-muted-foreground">Prevent content from being edited</p>
                      </div>
                      <Button 
                        variant={contentLocked ? "default" : "outline"}
                        className="flex items-center gap-1"
                        onClick={() => setContentLocked(!contentLocked)}
                      >
                        <Lock className="h-4 w-4" />
                        {contentLocked ? "Locked" : "Lock Content"}
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium">Order Address</h3>
                      <p className="text-sm text-muted-foreground mb-2">{order.address}</p>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Edit className="h-4 w-4" />
                        Update Address
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Activity Log - 30% */}
              <div className="lg:col-span-3 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Activity Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activityLog.map((activity, index) => (
                        <div key={index} className="border-l-2 border-muted pl-4 pb-4 relative">
                          <div className="absolute w-2 h-2 rounded-full bg-primary -left-[5px] top-1.5" />
                          <p className="text-sm font-medium">{activity.description}</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            {activity.type === 'email' ? 
                              <Mail className="h-3 w-3 mr-1" /> : 
                              <Activity className="h-3 w-3 mr-1" />
                            }
                            <span>{format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}</span>
                            <span className="mx-1">•</span>
                            <span>{activity.user}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        {/* Media Dialog */}
        <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Order Media</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {order.mediaLinks?.map((_, index) => (
                <div key={index} className="border rounded-md overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Media Preview {index + 1}</p>
                  </div>
                  <div className="p-2 flex justify-between items-center">
                    <span className="text-sm">Image {index + 1}</span>
                    <Button size="sm" variant="ghost">Download</Button>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Appointment Dialog */}
        <Dialog open={editAppointmentOpen} onOpenChange={setEditAppointmentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Appointment</DialogTitle>
              <DialogDescription>
                Update the details for this appointment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Appointment Date</h4>
                <Input
                  type="date"
                  defaultValue={format(new Date(order.scheduledDate), 'yyyy-MM-dd')}
                />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Appointment Time</h4>
                <Input
                  type="time"
                  defaultValue={order.scheduledTime.replace(/\s?(AM|PM)/i, '')}
                />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Photographer</h4>
                <Input
                  defaultValue={order.photographer}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditAppointmentOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                toast({
                  title: "Appointment Updated",
                  description: "The appointment details have been updated.",
                });
                setEditAppointmentOpen(false);
              }}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reschedule Dialog */}
        <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reschedule Appointment</DialogTitle>
              <DialogDescription>
                Select a new date and time for this appointment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">New Date</h4>
                <Input
                  type="date"
                  defaultValue={format(new Date(order.scheduledDate), 'yyyy-MM-dd')}
                />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">New Time</h4>
                <Input
                  type="time"
                  defaultValue={order.scheduledTime.replace(/\s?(AM|PM)/i, '')}
                />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Reason for Rescheduling</h4>
                <Textarea placeholder="Provide a reason for rescheduling..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                toast({
                  title: "Appointment Rescheduled",
                  description: "The appointment has been rescheduled successfully.",
                });
                setRescheduleDialogOpen(false);
              }}>Confirm Reschedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Appointment Dialog */}
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Appointment</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this appointment? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Reason for Cancellation</h4>
                <Textarea placeholder="Provide a reason for cancellation..." />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Notify Client</h4>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="notify-client" className="rounded border-gray-300" />
                  <label htmlFor="notify-client">Send cancellation notification to client</label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                Go Back
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmCancelAppointment}
              >
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Deliver Order Dialog */}
        <Dialog open={deliverDialogOpen} onOpenChange={setDeliverDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Deliver Order</DialogTitle>
              <DialogDescription>
                Send delivery notification to your client.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Recipient Email</h4>
                <Input
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder={order.clientEmail || "client@example.com"}
                />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Email Message</h4>
                <Textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Your order is ready! Click the link below to access your content."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="include-links" checked className="rounded border-gray-300" />
                  <label htmlFor="include-links">Include download links</label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeliverDialogOpen(false)}>Cancel</Button>
              <Button onClick={confirmDeliverOrder}>Send Delivery</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
};

export default OrderDetails;
