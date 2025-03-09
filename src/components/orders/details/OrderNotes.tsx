
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Order } from "@/types/order-types";

interface OrderNotesProps {
  order: Order | null;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const OrderNotes: React.FC<OrderNotesProps> = ({
  order,
  isEditing,
  onInputChange
}) => {
  if (!order) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customerNotes">Customer Notes</Label>
          {isEditing ? (
            <Textarea
              id="customerNotes"
              name="customerNotes"
              value={order.customerNotes || order.customer_notes || ''}
              onChange={onInputChange}
              rows={3}
            />
          ) : (
            <div className="p-2 bg-muted rounded-md min-h-[80px] whitespace-pre-wrap">
              {order.customerNotes || order.customer_notes || 'No customer notes'}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="internalNotes">Internal Notes</Label>
          {isEditing ? (
            <Textarea
              id="internalNotes"
              name="internalNotes"
              value={order.internalNotes || order.internal_notes || ''}
              onChange={onInputChange}
              rows={3}
            />
          ) : (
            <div className="p-2 bg-muted rounded-md min-h-[80px] whitespace-pre-wrap">
              {order.internalNotes || order.internal_notes || 'No internal notes'}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">General Notes</Label>
          {isEditing ? (
            <Textarea
              id="notes"
              name="notes"
              value={order.notes || ''}
              onChange={onInputChange}
              rows={3}
            />
          ) : (
            <div className="p-2 bg-muted rounded-md min-h-[80px] whitespace-pre-wrap">
              {order.notes || 'No general notes'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
