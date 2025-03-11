
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export interface DurationSelectorProps {
  value: number;
  onChange: (duration: number) => void;
  className?: string;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  value,
  onChange,
  className
}) => {
  const handleChange = (newValue: string) => {
    onChange(Number(newValue));
  };

  return (
    <div className={className || ""}>
      <Label htmlFor="duration">Duration (hours)</Label>
      <Select value={String(value)} onValueChange={handleChange}>
        <SelectTrigger id="duration">
          <SelectValue placeholder="Select duration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 hour</SelectItem>
          <SelectItem value="1.5">1.5 hours</SelectItem>
          <SelectItem value="2">2 hours</SelectItem>
          <SelectItem value="2.5">2.5 hours</SelectItem>
          <SelectItem value="3">3 hours</SelectItem>
          <SelectItem value="3.5">3.5 hours</SelectItem>
          <SelectItem value="4">4 hours</SelectItem>
          <SelectItem value="4.5">4.5 hours</SelectItem>
          <SelectItem value="5">5 hours</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
