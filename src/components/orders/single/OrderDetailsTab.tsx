
import React from 'react';
import { Order } from '@/types/order-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, MapPin, User, PhoneCall, Mail, FileText } from 'lucide-react';

interface OrderDetailsTabProps {
  order: Order;
}

export const OrderDetailsTab: React.FC<OrderDetailsTabProps> = ({ order }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Appointments section */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays className="h-5 w-5 mr-2" />
              Appointments
            </CardTitle>
            <CardDescription>
              Manage and schedule appointments for this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {order.scheduledDate || order.scheduled_date} at {order.scheduledTime || order.scheduled_time}
            </p>
            <p className="mt-2">Photographer: {order.photographer}</p>
            
            {/* Placeholder for appointment scheduling interface */}
            <div className="h-64 bg-muted/40 mt-4 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Appointment scheduling interface will be implemented here</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Order notes section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Order Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium mb-2">Customer Notes</h3>
            <p className="text-muted-foreground mb-4">{order.customerNotes || order.customer_notes || 'No customer notes'}</p>
            
            <Separator className="my-4" />
            
            <h3 className="font-medium mb-2">Internal Notes</h3>
            <p className="text-muted-foreground">{order.internalNotes || order.internal_notes || 'No internal notes'}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Customer details and activity feed */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{order.client}</h3>
              </div>
              
              <div className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-muted-foreground" />
                <span>{order.clientPhone || order.client_phone || 'No phone number'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{order.clientEmail || order.client_email || 'No email'}</span>
              </div>
              
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p>{order.address}</p>
                  <p>{order.city}, {order.state} {order.zip}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Order Activity Feed */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription>Recent actions and updates on this order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-primary pl-4 py-1">
                <p className="font-medium">Order created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              
              {/* Placeholder for activity feed items */}
              <p className="text-muted-foreground text-sm mt-2">The complete activity feed will be implemented with real data from the order_activities table.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
