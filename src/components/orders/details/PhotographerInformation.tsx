
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from '@/types/orders';

interface PhotographerInformationProps {
  editedOrder: Order | null;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export function PhotographerInformation({ editedOrder, isEditing, handleInputChange }: PhotographerInformationProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Photographer Information</CardTitle>
        <CardDescription>Details about the photographer</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="photographer">Photographer Name</Label>
            <Input
              type="text"
              id="photographer"
              name="photographer"
              value={editedOrder?.photographer || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="photographer_payout_rate">Photographer Payout Rate</Label>
            <Input
              type="number"
              id="photographer_payout_rate"
              name="photographer_payout_rate"
              value={editedOrder?.photographer_payout_rate || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
