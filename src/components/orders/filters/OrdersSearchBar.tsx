
import React, { memo, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface OrdersSearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  date: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
}

const OrdersSearchBar = memo(({
  searchQuery,
  onSearchChange,
  date,
  onDateSelect
}: OrdersSearchBarProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Search orders..."
        value={searchQuery}
        onChange={onSearchChange}
        className="max-w-[250px]"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateSelect}
            disabled={(date) =>
              date > new Date() || date < new Date("2023-01-01")
            }
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
});

OrdersSearchBar.displayName = 'OrdersSearchBar';

export default OrdersSearchBar;
