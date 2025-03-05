
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NotificationFiltersProps {
  filter: string;
  onFilterChange: (category: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  onClearAll: () => void;
  onMarkAllAsRead: () => void;
  unreadCount: number;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filter,
  onFilterChange,
  search,
  onSearchChange,
  onClearAll,
  onMarkAllAsRead,
  unreadCount
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-9 w-full" 
            placeholder="Search notifications..." 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="w-40">
            <Select value={filter} onValueChange={onFilterChange}>
              <SelectTrigger>
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All notifications</SelectItem>
                <SelectItem value="unread">Unread only</SelectItem>
                <SelectItem value="order">Orders</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        {unreadCount > 0 && (
          <Button variant="outline" onClick={onMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
        <Button variant="outline" className="ml-auto" onClick={onClearAll}>
          Clear all
        </Button>
      </div>
    </div>
  );
};
