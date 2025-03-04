import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  Upload
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders } = useSampleOrders();
  const [mediaDialogOpen, setMediaDialogOpen] = React.useState(false);
  
  const order = orders.find(o => o.id === Number(orderId));
  
  if (!order) {
    return (
      <SidebarLayout>
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
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main order info */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p>{order.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Home className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Property Type</h3>
                      <p>{order.propertyType} ({order.squareFeet} sq ft)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appointment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Scheduled Date</h3>
                      <p>{format(new Date(order.scheduledDate), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Scheduled Time</h3>
                      <p>{order.scheduledTime}</p>
                    </div>
                  </div>
                  
                  {order.additionalAppointments && order.additionalAppointments.length > 0 && (
                    <div className="pt-2">
                      <h3 className="font-medium mb-2">Additional Appointments</h3>
                      {order.additionalAppointments.map((apt, index) => (
                        <div key={index} className="ml-7 mb-2">
                          <p>
                            {format(new Date(apt.date), 'MMM d, yyyy')} at {apt.time}
                            <span className="ml-1 text-sm text-muted-foreground">
                              - {apt.description}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {(order.customerNotes || order.internalNotes) && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {order.customerNotes && (
                      <div>
                        <h3 className="font-medium flex items-center gap-1">
                          <FileText className="h-4 w-4" /> Customer Notes
                        </h3>
                        <p className="mt-1 text-muted-foreground">{order.customerNotes}</p>
                      </div>
                    )}
                    
                    {order.customerNotes && order.internalNotes && <Separator />}
                    
                    {order.internalNotes && (
                      <div>
                        <h3 className="font-medium flex items-center gap-1">
                          <FileText className="h-4 w-4" /> Internal Notes (Staff Only)
                        </h3>
                        <p className="mt-1 text-muted-foreground">{order.internalNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2 mb-4">
                    <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Client</h3>
                      <p>{order.client}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Photographer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2 mb-4">
                    <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Assigned Photographer</h3>
                      <p>{order.photographer}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Payout Rate</h3>
                      <p>${order.photographerPayoutRate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Order Number</h3>
                    <p>{order.orderNumber}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Price</h3>
                    <p>${order.price}</p>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-1"
                      onClick={() => {
                        if (order.mediaUploaded) {
                          setMediaDialogOpen(true);
                        } else {
                          toast({
                            title: "No media available",
                            description: "There is no media uploaded for this order yet.",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      <Image className="h-4 w-4" />
                      View Media
                    </Button>
                    
                    <Button 
                      className="w-full flex items-center justify-center gap-1"
                      onClick={() => {
                        toast({
                          title: "Edit functionality",
                          description: "The edit functionality would be implemented here in a real app."
                        });
                      }}
                    >
                      Edit Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Media Dialog */}
          <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Order Media</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {order.mediaLinks?.map((mediaUrl, index) => (
                  <div key={index} className="border rounded-md overflow-hidden">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <p className="text-muted-foreground">Media Preview {index + 1}</p>
                      {/* In a real implementation, this would display actual images */}
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
        </div>
      </PageTransition>
    </SidebarLayout>
  );
};

export default OrderDetails;
