
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Order } from '@/hooks/useSampleOrders';

interface OrderSearchProps {
  orders: Order[];
  onSearchResults: (results: Order[]) => void;
}

export const OrderSearch: React.FC<OrderSearchProps> = ({ 
  orders, 
  onSearchResults 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Only search when we have 2 or more characters
    if (searchTerm.length >= 2) {
      const filteredOrders = orders.filter(order => {
        const term = searchTerm.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(term) ||
          order.client.toLowerCase().includes(term) ||
          order.address.toLowerCase().includes(term)
        );
      });
      
      onSearchResults(filteredOrders);
    } else if (searchTerm.length === 0) {
      // If search is cleared, reset to all orders
      onSearchResults(orders);
    }
  }, [searchTerm, orders, onSearchResults]);
  
  const handleClearSearch = () => {
    setSearchTerm('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <div className="relative mb-4">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search order #, client name, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {focused && searchTerm.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {/* Predictive text functionality would be here */}
        </div>
      )}
    </div>
  );
};
