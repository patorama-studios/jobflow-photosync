
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RefundReasonFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const RefundReasonField: React.FC<RefundReasonFieldProps> = ({ 
  value, 
  onChange 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="refund-reason">Reason for Refund</Label>
      <Textarea
        id="refund-reason"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Please explain why you're processing this refund..."
        required
      />
    </div>
  );
};
