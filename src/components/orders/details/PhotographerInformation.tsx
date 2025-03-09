
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Order } from "@/types/order-types";

interface PhotographerInformationProps {
  order: Order | null;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PhotographerInformation: React.FC<PhotographerInformationProps> = ({
  order,
  isEditing,
  onInputChange
}) => {
  if (!order) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photographer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="photographer">Photographer</Label>
          {isEditing ? (
            <Input
              id="photographer"
              name="photographer"
              value={order.photographer || ''}
              onChange={onInputChange}
            />
          ) : (
            <div className="p-2 bg-muted rounded-md">{order.photographer || 'Not assigned'}</div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="photographerPayoutRate">Payout Rate</Label>
            {isEditing ? (
              <Input
                id="photographerPayoutRate"
                name="photographerPayoutRate"
                type="number"
                value={order.photographerPayoutRate || order.photographer_payout_rate || 0}
                onChange={onInputChange}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">
                ${order.photographerPayoutRate || order.photographer_payout_rate || 0}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="propertyType">Property Type</Label>
            {isEditing ? (
              <Input
                id="propertyType"
                name="propertyType"
                value={order.propertyType || order.property_type || ''}
                onChange={onInputChange}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">{order.propertyType || order.property_type || 'N/A'}</div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="squareFeet">Square Feet</Label>
          {isEditing ? (
            <Input
              id="squareFeet"
              name="squareFeet"
              type="number"
              value={order.squareFeet || order.square_feet || 0}
              onChange={onInputChange}
            />
          ) : (
            <div className="p-2 bg-muted rounded-md">{order.squareFeet || order.square_feet || 'N/A'} sq. ft.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
