
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface StatusFilterProps {
  label: string;
  status?: string;
  onStatusChange: (status: string | undefined) => void;
  options: { value: string; label: string }[];
}

export const StatusFilter: React.FC<StatusFilterProps> = ({ 
  label, 
  status, 
  onStatusChange,
  options
}) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">{label}</label>
      <Select
        value={status}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full text-xs h-8">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {status && status !== 'all' && (
        <div className="flex items-center mt-1">
          <Badge variant="outline" className="text-xs py-0 h-5">
            {label}: {status}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-3 w-3 ml-1 p-0"
              onClick={() => onStatusChange(undefined)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}
    </div>
  );
};
