
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, User, Home, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSampleOrders } from '@/hooks/useSampleOrders';

type OrdersListProps = {
  filter: 'all' | 'upcoming' | 'completed';
};

export const OrdersList: React.FC<OrdersListProps> = ({ filter }) => {
  const { orders } = useSampleOrders();
  
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return new Date(order.scheduledDate) >= new Date() && order.status !== 'completed';
    if (filter === 'completed') return order.status === 'completed';
    return true;
  });

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
                    <Button size="sm" variant="outline">View Details</Button>
                    {order.status !== 'completed' && (
                      <Button size="sm">Manage</Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
