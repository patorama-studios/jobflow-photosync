
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const OrderFormSection: React.FC = () => {
  return (
    <div>
      <p className="text-sm font-medium mb-2">Order Form Custom Fields</p>
      <p className="text-sm text-muted-foreground mb-2">Select the order form to pull the custom fields from.</p>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select an order form" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="standard">Standard Form</SelectItem>
          <SelectItem value="commercial">Commercial Form</SelectItem>
          <SelectItem value="residential">Residential Form</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
