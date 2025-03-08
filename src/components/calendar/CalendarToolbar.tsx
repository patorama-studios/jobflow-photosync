
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, CalendarIcon, LayoutDashboard, List } from "lucide-react";
import { format } from "date-fns";

interface CalendarToolbarProps {
  view: "month" | "week" | "day" | "agenda";
  selectedDate: Date;
  handleViewChange: (value: string) => void;
  navigatePrevious: () => void;
  navigateNext: () => void;
}

export function CalendarToolbar({ 
  view, 
  selectedDate, 
  handleViewChange, 
  navigatePrevious, 
  navigateNext 
}: CalendarToolbarProps) {
  return (
    <div className="p-2 md:p-4 border-b flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={navigatePrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-medium min-w-[140px] text-center">
          {view === 'month' 
            ? format(selectedDate, 'MMMM yyyy')
            : view === 'week'
              ? `Week of ${format(selectedDate, 'MMM d')}`
              : format(selectedDate, 'EEEE, MMM d')
          }
        </h2>
        <Button variant="outline" size="icon" onClick={navigateNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs value={view} onValueChange={handleViewChange}>
        <TabsList>
          <TabsTrigger value="month">
            <CalendarIcon className="h-4 w-4 mr-2 hidden sm:inline-block" />
            Month
          </TabsTrigger>
          <TabsTrigger value="week">
            <LayoutDashboard className="h-4 w-4 mr-2 hidden sm:inline-block" />
            Week
          </TabsTrigger>
          <TabsTrigger value="day">
            <List className="h-4 w-4 mr-2 hidden sm:inline-block" />
            Day
          </TabsTrigger>
          <TabsTrigger value="agenda">
            Agenda
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
