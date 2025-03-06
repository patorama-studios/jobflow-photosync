
import React, { memo } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from '@/types/orders';

interface OrderNotesProps {
  editedOrder: Order | null;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

// Use memo to prevent unnecessary re-renders
export const OrderNotes = memo(function OrderNotes({ 
  editedOrder, 
  isEditing, 
  handleInputChange 
}: OrderNotesProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <CardDescription>Internal and customer notes</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <Label htmlFor="internal_notes">Internal Notes</Label>
          <Textarea
            id="internal_notes"
            name="internal_notes"
            value={editedOrder?.internal_notes || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
        <div>
          <Label htmlFor="customer_notes">Customer Notes</Label>
          <Textarea
            id="customer_notes"
            name="customer_notes"
            value={editedOrder?.customer_notes || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>
      </CardContent>
    </Card>
  );
});
