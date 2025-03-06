
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from '@/types/orders';

interface ClientInformationProps {
  editedOrder: Order | null;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export function ClientInformation({ editedOrder, isEditing, handleInputChange }: ClientInformationProps) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
        <CardDescription>Details about the client</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="client">Client Name</Label>
            <Input
              type="text"
              id="client"
              name="client"
              value={editedOrder?.client || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="client_email">Client Email</Label>
            <Input
              type="email"
              id="client_email"
              name="client_email"
              value={editedOrder?.client_email || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="client_phone">Client Phone</Label>
            <Input
              type="tel"
              id="client_phone"
              name="client_phone"
              value={editedOrder?.client_phone || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              type="text"
              id="address"
              name="address"
              value={editedOrder?.address || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              type="text"
              id="city"
              name="city"
              value={editedOrder?.city || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              type="text"
              id="state"
              name="state"
              value={editedOrder?.state || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="zip">Zip Code</Label>
            <Input
              type="text"
              id="zip"
              name="zip"
              value={editedOrder?.zip || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
