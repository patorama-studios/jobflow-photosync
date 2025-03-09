
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RefundTypeSelectorProps {
  value: 'full' | 'partial';
  onChange: (value: 'full' | 'partial') => void;
  orderTotal: number;
}

export const RefundTypeSelector: React.FC<RefundTypeSelectorProps> = ({ 
  value, 
  onChange, 
  orderTotal 
}) => {
  return (
    <RadioGroup
      value={value}
      onValueChange={(value) => onChange(value as 'full' | 'partial')}
      className="space-y-2"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="full" id="full-refund" />
        <Label htmlFor="full-refund">Full Refund (${orderTotal.toFixed(2)})</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="partial" id="partial-refund" />
        <Label htmlFor="partial-refund">Partial Refund</Label>
      </div>
    </RadioGroup>
  );
};
