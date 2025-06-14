import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Calendar, FileText, Clock, User, Package, Edit, Save, X } from 'lucide-react';
import { useOrderSinglePage } from '@/hooks/use-order-single-page';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderDetailsError } from '@/components/orders/details/OrderDetailsError';

export default function OrderSinglePageNew() {
  const {
    order,
    isLoading,
    error,
    refetch,
    orderId,
    activeTab,
    setActiveTab,
    handleBackClick,
  } = useOrderSinglePage();

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedOrder, setEditedOrder] = useState(order);

  useEffect(() => {
    if (order) {
      setEditedOrder(order);
    }
  }, [order]);

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    // Here you would typically call an API to save the changes
    console.log('Saving order changes:', editedOrder);
    setEditDialogOpen(false);
    // Refetch the order data
    refetch();
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="container mx-auto p-6">
            <Skeleton className="h-8 w-96 mb-4" />
            <Skeleton className="h-10 w-full mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Skeleton className="h-96 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <PageTransition>
          <OrderDetailsError 
            error={error} 
            onRetry={refetch}
            isNewOrderPage={orderId === 'new'} 
          />
        </PageTransition>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageTransition>
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {order.orderNumber || `Order #${order.id}`} - {order.address}
              </h1>
            </div>
            <Button onClick={handleEditClick} size="lg">
              Edit Order
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Order Overview</TabsTrigger>
              <TabsTrigger value="invoicing">Invoicing & Products</TabsTrigger>
              <TabsTrigger value="production">Production</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Job Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Job Details Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Job Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{order.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{order.scheduledDate} {order.scheduledTime}</span>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Booking notes</h4>
                        <p className="text-gray-600">{order.customerNotes || order.notes || 'No booking notes available'}</p>
                      </div>
                      
                      {/* Google Map */}
                      <div className="mt-6">
                        <div className="bg-gray-100 rounded-lg h-64 relative overflow-hidden">
                          <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/place?key=${localStorage.getItem('google_maps_api_key') || process.env.REACT_APP_GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(order.address)}`}
                            onError={() => {
                              // Fallback to static map if API key is not available
                              console.log('Google Maps API key not found, showing fallback');
                            }}
                          ></iframe>
                          
                          {/* Fallback content */}
                          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center" 
                               style={{ 
                                 display: localStorage.getItem('google_maps_api_key') || process.env.REACT_APP_GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY ? 'none' : 'flex' 
                               }}>
                            <div className="text-center">
                              <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">Map view of {order.address}</p>
                              <p className="text-xs text-gray-500 mt-1">Configure Google Maps API key in integrations to view map</p>
                            </div>
                          </div>
                          
                          {order.drivingTimeMin && (
                            <div className="absolute bottom-4 right-4 bg-white rounded-lg p-2 shadow-sm">
                              <div className="text-sm">
                                <div className="font-medium">Drive time</div>
                                <div className="text-blue-600">{order.drivingTimeMin} min before</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Products Ordered Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Products Ordered
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="font-medium">{order.package || 'Photography Package'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{order.status === 'scheduled' ? 'Not Started' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Badge>
                          <span className="text-sm text-gray-600">${order.price}</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-sm text-gray-600">Property: {order.propertyType} • {order.squareFeet} sq ft</div>
                      </div>
                    </CardContent>
                  </Card>

                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                  {/* Assigned Team Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Assigned Team</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-semibold">{order.photographer}</div>
                          <div className="text-sm text-gray-600">Photographer</div>
                        </div>
                      </div>
                      {order.photographerPayoutRate && (
                        <div className="text-sm text-gray-600 mt-2">
                          Payout Rate: ${order.photographerPayoutRate}/hour
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Order Notes Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {order.notes && (
                        <div>
                          <h4 className="font-medium text-sm mb-1">General Notes</h4>
                          <p className="text-sm text-gray-600">{order.notes}</p>
                        </div>
                      )}
                      {order.internalNotes && (
                        <div>
                          <h4 className="font-medium text-sm mb-1">Internal Notes</h4>
                          <p className="text-sm text-gray-600">{order.internalNotes}</p>
                        </div>
                      )}
                      {order.customerNotes && (
                        <div>
                          <h4 className="font-medium text-sm mb-1">Customer Notes</h4>
                          <p className="text-sm text-gray-600">{order.customerNotes}</p>
                        </div>
                      )}
                      {(!order.notes && !order.internalNotes && !order.customerNotes) && (
                        <p className="text-sm text-gray-400">No notes available</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="invoicing" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Products & Assignment */}
                <Card>
                  <CardHeader>
                    <CardTitle>Products & Assignment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <span className="font-medium">{order.package || 'Photography Package'}</span>
                            <div className="text-sm text-gray-500">{order.propertyType} • {order.squareFeet} sq ft</div>
                            <div className="text-sm font-medium text-blue-600 mt-1">
                              Assigned to: {order.photographer}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">${order.price}</div>
                          <Badge variant="outline" className="mt-1">
                            {order.status === 'scheduled' ? 'Not Started' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Photographer Payout */}
                <Card>
                  <CardHeader>
                    <CardTitle>Photographer Payout</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{order.photographer}</div>
                          <div className="text-sm text-gray-600">
                            {order.package || 'Photography Package'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-600">
                            ${order.photographerPayoutRate || 'TBD'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.photographerPayoutRate ? 'Per job' : 'Rate not set'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Payout Breakdown</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Base Rate:</span>
                            <span>${order.photographerPayoutRate || '0'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Travel Time ({order.drivingTimeMin || 0} min):</span>
                            <span>$0</span>
                          </div>
                          <div className="flex justify-between font-medium pt-2 border-t">
                            <span>Total Payout:</span>
                            <span className="text-green-600">${order.photographerPayoutRate || '0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Invoice Details */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Invoice Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Order Information</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Order #:</span>
                            <span>{order.orderNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Date:</span>
                            <span>{order.scheduledDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span>{order.status}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Client Information</h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="font-medium">{order.client}</span>
                          </div>
                          <div>{order.clientEmail}</div>
                          <div>{order.clientPhone}</div>
                          <div>{order.address}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Financial Summary</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>${order.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax:</span>
                            <span>$0.00</span>
                          </div>
                          <div className="flex justify-between font-medium pt-2 border-t">
                            <span>Total:</span>
                            <span>${order.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="production" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Production Pipeline</CardTitle>
                    <CardDescription>
                      Track the production status of all items in this order
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Production Item */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div>
                              <span className="font-medium">{order.package || 'Photography Package'}</span>
                              <div className="text-sm text-gray-500">{order.propertyType}</div>
                            </div>
                          </div>
                          <Badge variant={order.status === 'completed' ? 'default' : order.status === 'in_progress' ? 'secondary' : 'outline'}>
                            {order.status === 'scheduled' ? 'Not Started' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        
                        {/* Production Stages */}
                        <div className="flex items-center gap-2 mt-4">
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                            ['completed', 'in_progress', 'editing', 'review'].includes(order.status) 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              ['completed', 'in_progress', 'editing', 'review'].includes(order.status) 
                                ? 'bg-green-500' 
                                : 'bg-gray-400'
                            }`}></div>
                            Photography
                          </div>
                          
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                            ['completed', 'editing', 'review'].includes(order.status) 
                              ? 'bg-blue-100 text-blue-800' 
                              : order.status === 'in_progress' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              ['completed', 'editing', 'review'].includes(order.status) 
                                ? 'bg-blue-500' 
                                : order.status === 'in_progress' 
                                  ? 'bg-yellow-500'
                                  : 'bg-gray-400'
                            }`}></div>
                            Editing
                          </div>
                          
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                            ['completed', 'review'].includes(order.status) 
                              ? 'bg-purple-100 text-purple-800' 
                              : order.status === 'editing' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              ['completed', 'review'].includes(order.status) 
                                ? 'bg-purple-500' 
                                : order.status === 'editing' 
                                  ? 'bg-yellow-500'
                                  : 'bg-gray-400'
                            }`}></div>
                            Review
                          </div>
                          
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                            order.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              ['completed', 'delivered'].includes(order.status) 
                                ? 'bg-green-500' 
                                : 'bg-gray-400'
                            }`}></div>
                            Delivery
                          </div>
                        </div>
                        
                        {/* Additional Details */}
                        <div className="mt-4 pt-4 border-t text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-gray-500">Assigned to:</span>
                              <span className="ml-2 font-medium">{order.photographer}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Scheduled:</span>
                              <span className="ml-2">{order.scheduledDate} at {order.scheduledTime}</span>
                            </div>
                            {order.completedDate && (
                              <div>
                                <span className="text-gray-500">Completed:</span>
                                <span className="ml-2">{order.completedDate}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Production Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Production Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <div className="font-medium">Order Created</div>
                          <div className="text-sm text-gray-600">{order.scheduledDate}</div>
                        </div>
                      </div>
                      
                      {order.status !== 'pending' && order.status !== 'scheduled' && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <div className="font-medium">Photography Started</div>
                            <div className="text-sm text-gray-600">
                              {order.status === 'in_progress' ? 'In progress' : 'Completed'}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {['editing', 'review', 'completed', 'delivered'].includes(order.status) && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          <div>
                            <div className="font-medium">Editing Phase</div>
                            <div className="text-sm text-gray-600">
                              {order.status === 'editing' ? 'Currently editing' : 'Editing completed'}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {['completed', 'delivered'].includes(order.status) && (
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <div className="font-medium">Delivery</div>
                            <div className="text-sm text-gray-600">
                              {order.completedDate ? `Completed on ${order.completedDate}` : 'Ready for delivery'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Activity</CardTitle>
                  <CardDescription>
                    Complete timeline of all changes and updates to this order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Activity Item */}
                    <div className="flex items-start gap-4 pb-4 border-b">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium">Order Created</div>
                          <div className="text-sm text-gray-500">
                            {order.scheduledDate} • System
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Order {order.orderNumber} was created for {order.client} at {order.address}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Package: {order.package || 'Photography Package'} • ${order.price}
                        </div>
                      </div>
                    </div>

                    {/* Assignment Activity */}
                    <div className="flex items-start gap-4 pb-4 border-b">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium">Photographer Assigned</div>
                          <div className="text-sm text-gray-500">
                            {order.scheduledDate} • Admin
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.photographer} was assigned to this order
                        </div>
                        {order.photographerPayoutRate && (
                          <div className="text-xs text-gray-500 mt-1">
                            Payout rate: ${order.photographerPayoutRate}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Updates */}
                    {order.status !== 'pending' && order.status !== 'scheduled' && (
                      <div className="flex items-start gap-4 pb-4 border-b">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium">Status Updated</div>
                            <div className="text-sm text-gray-500">
                              {order.scheduledDate} • {order.photographer}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Order status changed to "{order.status.charAt(0).toUpperCase() + order.status.slice(1)}"
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Completion Activity */}
                    {order.completedDate && (
                      <div className="flex items-start gap-4 pb-4 border-b">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium">Order Completed</div>
                            <div className="text-sm text-gray-500">
                              {order.completedDate} • {order.photographer}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Photography and editing completed. Order ready for delivery.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes Activity */}
                    {order.notes && (
                      <div className="flex items-start gap-4 pb-4 border-b">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium">Note Added</div>
                            <div className="text-sm text-gray-500">
                              {order.scheduledDate} • Admin
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            "{order.notes}"
                          </div>
                        </div>
                      </div>
                    )}

                    {order.internalNotes && (
                      <div className="flex items-start gap-4 pb-4 border-b">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium">Internal Note Added</div>
                            <div className="text-sm text-gray-500">
                              {order.scheduledDate} • Admin
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            "{order.internalNotes}"
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Customer Communication */}
                    {order.customerNotes && (
                      <div className="flex items-start gap-4 pb-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium">Customer Communication</div>
                            <div className="text-sm text-gray-500">
                              {order.scheduledDate} • {order.client}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            "{order.customerNotes}"
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {!order.notes && !order.internalNotes && !order.customerNotes && (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-sm">No additional activity to display</div>
                        <div className="text-xs mt-1">Activity will appear here as the order progresses</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Edit Order Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Order {order?.orderNumber}</DialogTitle>
              <DialogDescription>
                Update order details, client information, and assignments
              </DialogDescription>
            </DialogHeader>

            {editedOrder && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                {/* Client Information */}
                <div className="space-y-4">
                  <h4 className="font-medium">Client Information</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="client">Client Name</Label>
                    <Input
                      id="client"
                      value={editedOrder.client || ''}
                      onChange={(e) => setEditedOrder({...editedOrder, client: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Client Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={editedOrder.clientEmail || ''}
                      onChange={(e) => setEditedOrder({...editedOrder, clientEmail: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Client Phone</Label>
                    <Input
                      id="clientPhone"
                      value={editedOrder.clientPhone || ''}
                      onChange={(e) => setEditedOrder({...editedOrder, clientPhone: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Property Address</Label>
                    <Input
                      id="address"
                      value={editedOrder.address || ''}
                      onChange={(e) => setEditedOrder({...editedOrder, address: e.target.value})}
                    />
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-4">
                  <h4 className="font-medium">Order Details</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="package">Package/Service</Label>
                    <Input
                      id="package"
                      value={editedOrder.package || ''}
                      onChange={(e) => setEditedOrder({...editedOrder, package: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type</Label>
                    <Input
                      id="propertyType"
                      value={editedOrder.propertyType || ''}
                      onChange={(e) => setEditedOrder({...editedOrder, propertyType: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="squareFeet">Square Feet</Label>
                    <Input
                      id="squareFeet"
                      type="number"
                      value={editedOrder.squareFeet || ''}
                      onChange={(e) => setEditedOrder({...editedOrder, squareFeet: parseInt(e.target.value) || 0})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={editedOrder.price || ''}
                      onChange={(e) => setEditedOrder({...editedOrder, price: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>

                {/* Assignment & Scheduling */}
                <div className="space-y-4">
                  <h4 className="font-medium">Assignment & Scheduling</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="photographer">Photographer</Label>
                    <Input
                      id="photographer"
                      value={editedOrder.photographer || ''}
                      onChange={(e) => setEditedOrder({...editedOrder, photographer: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="photographerPayoutRate">Photographer Payout Rate</Label>
                    <Input
                      id="photographerPayoutRate"
                      type="number"
                      value={editedOrder.photographerPayoutRate || ''}
                      onChange={(e) => setEditedOrder({...editedOrder, photographerPayoutRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Scheduled Date</Label>
                    <Input
                      id="scheduledDate"
                      type="date"
                      value={editedOrder.scheduledDate || ''}
                      onChange={(e) => setEditedOrder({...editedOrder, scheduledDate: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime">Scheduled Time</Label>
                    <Input
                      id="scheduledTime"
                      type="time"
                      value={editedOrder.scheduledTime || ''}
                      onChange={(e) => setEditedOrder({...editedOrder, scheduledTime: e.target.value})}
                    />
                  </div>
                </div>

                {/* Notes & Status */}
                <div className="space-y-4">
                  <h4 className="font-medium">Notes & Status</h4>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={editedOrder.status}
                      onValueChange={(value) => setEditedOrder({...editedOrder, status: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="editing">Editing</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">General Notes</Label>
                    <Input
                      id="notes"
                      value={editedOrder.notes || ''}
                      onChange={(e) => setEditedOrder({...editedOrder, notes: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="internalNotes">Internal Notes</Label>
                    <Input
                      id="internalNotes"
                      value={editedOrder.internalNotes || ''}
                      onChange={(e) => setEditedOrder({...editedOrder, internalNotes: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerNotes">Customer Notes</Label>
                    <Input
                      id="customerNotes"
                      value={editedOrder.customerNotes || ''}
                      onChange={(e) => setEditedOrder({...editedOrder, customerNotes: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageTransition>
    </MainLayout>
  );
}