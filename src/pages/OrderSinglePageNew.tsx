import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, FileText, Clock, User, Package } from 'lucide-react';
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
    handleEditClick,
    handleBackClick,
  } = useOrderSinglePage();

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
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Order Overview</TabsTrigger>
              <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
              <TabsTrigger value="products">Products Ordered</TabsTrigger>
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
                        <p className="text-gray-600">Gate code 1234</p>
                      </div>
                      
                      {/* Map placeholder */}
                      <div className="mt-6">
                        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center relative">
                          <div className="text-center">
                            <MapPin className="h-8 w-8 text-red-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Map view of {order.address}</p>
                          </div>
                          <div className="absolute bottom-4 right-4 bg-white rounded-lg p-2 shadow-sm">
                            <div className="text-sm">
                              <div className="font-medium">Drive time</div>
                              <div className="text-blue-600">25 min before</div>
                            </div>
                          </div>
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
                          <span className="font-medium">Photography — Daylight</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">Not Started</Badge>
                          <span className="text-sm text-gray-600">45 mins</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="text-sm text-gray-600">15 mins</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Assigned Team Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Assigned Team
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium">Kristen Peters</div>
                          <div className="text-sm text-gray-600">Editor</div>
                        </div>
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
                          <div className="font-semibold">Steven Murphy</div>
                          <div className="text-sm text-gray-600">Editor</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-semibold">Rebecca Ress</div>
                          <div className="text-sm text-gray-600">Content Creator</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Notes Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="link" className="p-0 h-auto text-blue-600">
                        Kristen Property Details
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Additional Order Notes Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="link" className="p-0 h-auto text-blue-600">
                        View Property Details
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="invoicing" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoicing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Invoicing details will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Products Ordered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">Photography — Daylight</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">Not Started</Badge>
                        <span className="text-sm text-gray-600">45 mins</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="production" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Production</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Production details will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Activity timeline will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </MainLayout>
  );
}