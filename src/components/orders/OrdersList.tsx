
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, User, Home, CheckCircle, AlertCircle, FileText, Image, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useSampleOrders } from '@/hooks/useSampleOrders';
import { toast } from '@/components/ui/use-toast';

type OrdersListProps = {
  filter: 'all' | 'upcoming' | 'completed';
};

export const OrdersList: React.FC<OrdersListProps> = ({ filter }) => {
  const { orders } = useSampleOrders();
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<string[]>([]);
  
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return new Date(order.scheduledDate) >= new Date() && order.status !== 'completed';
    if (filter === 'completed') return order.status === 'completed';
    return true;
  });

  const handleViewDetails = (orderId: number) => {
    setSelectedOrder(selectedOrder === orderId ? null : orderId);
  };

  const handleViewMedia = (mediaLinks: string[] | undefined) => {
    if (mediaLinks && mediaLinks.length > 0) {
      setCurrentMedia(mediaLinks);
      setMediaDialogOpen(true);
    } else {
      toast({
        title: "No media available",
        description: "There is no media uploaded for this order yet.",
        variant: "destructive"
      });
    }
  };

  const handleUploadMedia = () => {
    setUploadDialogOpen(true);
    // In a real implementation, this would connect to an upload service
  };

  const mockUploadMedia = () => {
    toast({
      title: "Media uploaded successfully",
      description: "Your media files have been uploaded and are now available for viewing.",
    });
    setUploadDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        order.status === 'completed' ? 'default' :
                        order.status === 'scheduled' ? 'secondary' : 'outline'
                      }
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <h3 className="text-lg font-medium">{order.propertyType} Photography</h3>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{order.address}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{format(new Date(order.scheduledDate), 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{order.scheduledTime}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{order.photographer}</span>
                    </div>
                    <div className="flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      <span>{order.squareFeet} sqft</span>
                    </div>
                  </div>
                  
                  <div className="pt-1">
                    <span className="text-sm font-medium">Client: </span>
                    <span className="text-sm">{order.client}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                  <div className="flex items-center">
                    {order.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    ) : order.status === 'pending' ? (
                      <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                    ) : null}
                    <span className="font-medium">${order.price}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewDetails(order.id)}
                    >
                      {selectedOrder === order.id ? "Hide Details" : "View Details"}
                    </Button>
                    {order.status !== 'completed' && (
                      <Button size="sm">Manage</Button>
                    )}
                  </div>
                </div>
              </div>

              <Collapsible open={selectedOrder === order.id} className="mt-4">
                <CollapsibleContent className="space-y-4">
                  <div className="bg-muted/40 p-4 rounded-md">
                    {order.customerNotes ? (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold flex items-center gap-1 mb-2">
                          <FileText className="h-4 w-4" /> Customer Notes
                        </h4>
                        <p className="text-sm text-muted-foreground">{order.customerNotes}</p>
                      </div>
                    ) : null}

                    {order.internalNotes ? (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold flex items-center gap-1 mb-2">
                          <FileText className="h-4 w-4" /> Internal Notes (Staff Only)
                        </h4>
                        <p className="text-sm text-muted-foreground">{order.internalNotes}</p>
                      </div>
                    ) : null}

                    {order.additionalAppointments && order.additionalAppointments.length > 0 ? (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold mb-2">Additional Appointments</h4>
                        <ul className="space-y-2">
                          {order.additionalAppointments.map((apt, index) => (
                            <li key={index} className="text-sm flex gap-2">
                              <span className="text-muted-foreground">{format(new Date(apt.date), 'MMM d')} at {apt.time}</span>
                              <span>-</span>
                              <span>{apt.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center gap-1"
                          onClick={() => order.mediaLinks && handleViewMedia(order.mediaLinks)}
                          disabled={!order.mediaUploaded}
                        >
                          <Image className="h-4 w-4" />
                          View Media
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex items-center gap-1"
                          onClick={handleUploadMedia}
                        >
                          <Upload className="h-4 w-4" />
                          Upload Content
                        </Button>
                      </div>

                      <div>
                        <Button size="sm" variant="secondary">Edit Order</Button>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        ))
      )}

      {/* Media Viewing Dialog */}
      <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Media</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {currentMedia.map((mediaUrl, index) => (
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

      {/* Media Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Drag and drop files here, or click to select files
              </p>
              <Button size="sm" variant="outline" className="mt-4">
                Select Files
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Upload Notes (Optional)</h4>
              <Textarea placeholder="Add any notes about this upload..." className="min-h-[100px]" />
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={mockUploadMedia}>
                Upload Files
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
