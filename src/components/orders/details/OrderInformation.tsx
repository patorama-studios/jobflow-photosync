
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Order, OrderStatus } from '@/types/orders';

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "canceled", label: "Canceled" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "in_progress", label: "In Progress" },
  { value: "editing", label: "Editing" },
  { value: "review", label: "Review" },
  { value: "delivered", label: "Delivered" },
];

interface OrderInformationProps {
  editedOrder: Order | null;
  isEditing: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (status: OrderStatus) => void;
}

export function OrderInformation({ editedOrder, isEditing, handleInputChange, handleStatusChange }: OrderInformationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Information</CardTitle>
        <CardDescription>Details about the order</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="order_number">Order Number</Label>
            <Input
              type="text"
              id="order_number"
              name="order_number"
              value={editedOrder?.order_number || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            {isEditing ? (
              <Select value={editedOrder?.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type="text"
                id="status"
                name="status"
                value={editedOrder?.status || ""}
                disabled
              />
            )}
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              id="price"
              name="price"
              value={editedOrder?.price || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="scheduled_date">Scheduled Date</Label>
              <Input
                type="text"
                id="scheduled_date"
                name="scheduled_date"
                value={editedOrder?.scheduled_date || ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
          </div>
          <div>
            <Label htmlFor="scheduled_time">Scheduled Time</Label>
            <Input
              type="text"
              id="scheduled_time"
              name="scheduled_time"
              value={editedOrder?.scheduled_time || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="property_type">Property Type</Label>
            <Input
              type="text"
              id="property_type"
              name="property_type"
              value={editedOrder?.property_type || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="square_feet">Square Feet</Label>
            <Input
              type="number"
              id="square_feet"
              name="square_feet"
              value={editedOrder?.square_feet || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
