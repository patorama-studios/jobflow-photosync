
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Order } from "@/types/order-types";

interface ClientInformationProps {
  order: Order | null;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ClientInformation: React.FC<ClientInformationProps> = ({
  order,
  isEditing,
  onInputChange
}) => {
  if (!order) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Client Name</Label>
          {isEditing ? (
            <Input
              id="customerName"
              name="customerName"
              value={order.customerName || order.client || ''}
              onChange={onInputChange}
            />
          ) : (
            <div className="p-2 bg-muted rounded-md">{order.customerName || order.client || 'N/A'}</div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email</Label>
            {isEditing ? (
              <Input
                id="clientEmail"
                name="clientEmail"
                type="email"
                value={order.clientEmail || order.client_email || ''}
                onChange={onInputChange}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">{order.clientEmail || order.client_email || 'N/A'}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientPhone">Phone</Label>
            {isEditing ? (
              <Input
                id="clientPhone"
                name="clientPhone"
                value={order.clientPhone || order.client_phone || ''}
                onChange={onInputChange}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">{order.clientPhone || order.client_phone || 'N/A'}</div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="propertyAddress">Address</Label>
          {isEditing ? (
            <Input
              id="propertyAddress"
              name="propertyAddress"
              value={order.propertyAddress || order.address || ''}
              onChange={onInputChange}
            />
          ) : (
            <div className="p-2 bg-muted rounded-md">{order.propertyAddress || order.address || 'N/A'}</div>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            {isEditing ? (
              <Input
                id="city"
                name="city"
                value={order.city || ''}
                onChange={onInputChange}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">{order.city || 'N/A'}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            {isEditing ? (
              <Input
                id="state"
                name="state"
                value={order.state || ''}
                onChange={onInputChange}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">{order.state || 'N/A'}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP</Label>
            {isEditing ? (
              <Input
                id="zip"
                name="zip"
                value={order.zip || ''}
                onChange={onInputChange}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">{order.zip || 'N/A'}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
