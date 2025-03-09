
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RefundAmountFieldProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
}

export const RefundAmountField: React.FC<RefundAmountFieldProps> = ({ 
  value, 
  onChange, 
  max 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="refund-amount">Refund Amount</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
        <Input
          id="refund-amount"
          type="number"
          min="0.01"
          step="0.01"
          max={max}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="pl-7"
        />
      </div>
    </div>
  );
};
