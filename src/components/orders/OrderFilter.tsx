
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type OrderFilterProps = {
  status: string;
  onStatusChange: (status: string) => void;
};

export const OrderFilter: React.FC<OrderFilterProps> = ({ 
  status, 
  onStatusChange 
}) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Filter by status:</span>
      <Select 
        value={status}
        onValueChange={onStatusChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Orders</SelectItem>
          <SelectItem value="pending">Not Scheduled</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="outstanding">Outstanding (Not Completed)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
