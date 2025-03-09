
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Order } from "@/types/order-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderInformationProps {
  order: Order | null;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (status: string) => void;
}

export const OrderInformation: React.FC<OrderInformationProps> = ({
  order,
  isEditing,
  onInputChange,
  onStatusChange
}) => {
  if (!order) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="orderNumber">Order Number</Label>
            {isEditing ? (
              <Input
                id="orderNumber"
                name="orderNumber"
                value={order.orderNumber || order.order_number || ''}
                onChange={onInputChange}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">{order.orderNumber || order.order_number || 'N/A'}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            {isEditing ? (
              <Select 
                value={order.status} 
                onValueChange={onStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className={`p-2 rounded-md ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="scheduledDate">Scheduled Date</Label>
            {isEditing ? (
              <Input
                id="scheduledDate"
                name="scheduledDate"
                type="date"
                value={order.scheduledDate || order.scheduled_date || ''}
                onChange={onInputChange}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">
                {order.scheduledDate || order.scheduled_date
                  ? new Date(order.scheduledDate || order.scheduled_date).toLocaleDateString()
                  : 'Not scheduled'}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="scheduledTime">Scheduled Time</Label>
            {isEditing ? (
              <Input
                id="scheduledTime"
                name="scheduledTime"
                value={order.scheduledTime || order.scheduled_time || ''}
                onChange={onInputChange}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">{order.scheduledTime || order.scheduled_time || 'N/A'}</div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="package">Package</Label>
            {isEditing ? (
              <Input
                id="package"
                name="package"
                value={order.package || ''}
                onChange={onInputChange}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">{order.package || 'N/A'}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            {isEditing ? (
              <Input
                id="price"
                name="price"
                type="number"
                value={order.price || order.amount || 0}
                onChange={onInputChange}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">${order.price || order.amount || 0}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
