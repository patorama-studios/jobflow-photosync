
import React from 'react';
import { Order } from '@/types/order-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface OrderDetailsTabProps {
  order: Order;
  editedOrder: Order | null;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onStatusChange: (status: string) => void;
}

export function OrderDetailsTab({
  order,
  editedOrder,
  isEditing,
  onInputChange,
  onStatusChange
}: OrderDetailsTabProps) {
  const displayOrder = editedOrder || order;
  
  return (
    <TabsContent value="details" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {isEditing ? (
                <Select 
                  name="status" 
                  value={displayOrder.status} 
                  onValueChange={onStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input readOnly value={displayOrder.status} />
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input 
                id="orderNumber"
                name="orderNumber"
                value={displayOrder.orderNumber}
                onChange={onInputChange}
                readOnly={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input 
                id="scheduledDate"
                name="scheduledDate"
                type="date"
                value={displayOrder.scheduledDate}
                onChange={onInputChange}
                readOnly={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Scheduled Time</Label>
              <Input 
                id="scheduledTime"
                name="scheduledTime"
                type="time"
                value={displayOrder.scheduledTime}
                onChange={onInputChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes"
              name="notes"
              value={displayOrder.notes || ''}
              onChange={onInputChange}
              readOnly={!isEditing}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client Name</Label>
              <Input 
                id="client"
                name="client"
                value={displayOrder.client}
                onChange={onInputChange}
                readOnly={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email</Label>
              <Input 
                id="clientEmail"
                name="clientEmail"
                value={displayOrder.clientEmail || displayOrder.client_email || ''}
                onChange={onInputChange}
                readOnly={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Phone</Label>
              <Input 
                id="clientPhone"
                name="clientPhone"
                value={displayOrder.clientPhone || displayOrder.client_phone || ''}
                onChange={onInputChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address"
                name="address"
                value={displayOrder.address}
                onChange={onInputChange}
                readOnly={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <Input 
                id="propertyType"
                name="propertyType"
                value={displayOrder.propertyType || displayOrder.property_type || ''}
                onChange={onInputChange}
                readOnly={!isEditing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="squareFeet">Square Feet</Label>
              <Input 
                id="squareFeet"
                name="squareFeet"
                type="number"
                value={displayOrder.squareFeet || displayOrder.square_feet || 0}
                onChange={onInputChange}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
