
import React from 'react';
import { Order } from '@/types/order-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface OrderDetailsTabProps {
  order: Order;
}

export function OrderDetailsTab({ order }: OrderDetailsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <dt className="text-sm font-medium text-muted-foreground">Order Number</dt>
            <dd className="text-sm">{order.orderNumber || order.order_number}</dd>
            
            <dt className="text-sm font-medium text-muted-foreground">Status</dt>
            <dd className="text-sm capitalize">{order.status}</dd>
            
            <dt className="text-sm font-medium text-muted-foreground">Scheduled Date</dt>
            <dd className="text-sm">
              {order.scheduledDate 
                ? format(new Date(order.scheduledDate), "MMMM d, yyyy") 
                : "Not scheduled"}
            </dd>
            
            <dt className="text-sm font-medium text-muted-foreground">Scheduled Time</dt>
            <dd className="text-sm">{order.scheduledTime || order.scheduled_time || "N/A"}</dd>
            
            <dt className="text-sm font-medium text-muted-foreground">Package</dt>
            <dd className="text-sm">{order.package || "N/A"}</dd>
            
            <dt className="text-sm font-medium text-muted-foreground">Price</dt>
            <dd className="text-sm">${order.price || 0}</dd>
          </dl>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <dt className="text-sm font-medium text-muted-foreground">Client Name</dt>
            <dd className="text-sm">{order.client || order.customerName || "N/A"}</dd>
            
            <dt className="text-sm font-medium text-muted-foreground">Email</dt>
            <dd className="text-sm">{order.clientEmail || order.client_email || "N/A"}</dd>
            
            <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
            <dd className="text-sm">{order.clientPhone || order.client_phone || "N/A"}</dd>
            
            <dt className="text-sm font-medium text-muted-foreground">Full Address</dt>
            <dd className="text-sm">
              {[
                order.address || order.propertyAddress,
                order.city,
                order.state,
                order.zip
              ].filter(Boolean).join(', ')}
            </dd>
          </dl>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <dt className="text-sm font-medium text-muted-foreground">Property Type</dt>
            <dd className="text-sm">{order.propertyType || order.property_type || "N/A"}</dd>
            
            <dt className="text-sm font-medium text-muted-foreground">Square Feet</dt>
            <dd className="text-sm">{order.squareFeet || order.square_feet || "N/A"}</dd>
          </dl>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assignment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <dt className="text-sm font-medium text-muted-foreground">Photographer</dt>
            <dd className="text-sm">{order.photographer || "Not assigned"}</dd>
            
            <dt className="text-sm font-medium text-muted-foreground">Photographer Rate</dt>
            <dd className="text-sm">
              ${order.photographerPayoutRate || order.photographer_payout_rate || "N/A"}
            </dd>
          </dl>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Notes</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Customer Notes</h4>
            <div className="p-3 bg-muted rounded-md min-h-[100px] text-sm whitespace-pre-wrap">
              {order.customerNotes || order.customer_notes || "No customer notes"}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Internal Notes</h4>
            <div className="p-3 bg-muted rounded-md min-h-[100px] text-sm whitespace-pre-wrap">
              {order.internalNotes || order.internal_notes || "No internal notes"}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h4 className="text-sm font-medium mb-2">Additional Notes</h4>
            <div className="p-3 bg-muted rounded-md min-h-[100px] text-sm whitespace-pre-wrap">
              {order.notes || "No additional notes"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
