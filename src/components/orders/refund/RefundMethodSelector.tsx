
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RefundMethodSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const RefundMethodSelector: React.FC<RefundMethodSelectorProps> = ({ 
  value, 
  onValueChange 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="refund-method">Refund Method</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
      >
        <SelectTrigger id="refund-method">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="original">Refund to Original Payment Method</SelectItem>
          <SelectItem value="store_credit">Store Credit</SelectItem>
          <SelectItem value="manual">Manual Refund (processed offline)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
