
import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: string;
  setViewMode: (mode: string) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  handleToday: () => void;
  getDateRangeTitle: () => string;
  showCalendarSubmenu: boolean;
  setShowCalendarSubmenu: (show: boolean) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewMode,
  setViewMode,
  handlePrevious,
  handleNext,
  handleToday,
  getDateRangeTitle,
  showCalendarSubmenu,
  setShowCalendarSubmenu
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8" 
          onClick={() => setShowCalendarSubmenu(!showCalendarSubmenu)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">Calendar</h1>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={handleToday}
        >
          Today
        </Button>
        
        <div className="flex items-center rounded-md border border-input">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-r-none border-r"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-3 text-sm">
            {getDateRangeTitle()}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-l-none border-l"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Tabs 
          value={viewMode} 
          onValueChange={(v) => setViewMode(v)}
          className="h-8"
        >
          <TabsList className="h-8">
            <TabsTrigger 
              value="day" 
              className="text-xs px-2 h-7"
            >
              Day
            </TabsTrigger>
            <TabsTrigger 
              value="week" 
              className="text-xs px-2 h-7"
            >
              Week
            </TabsTrigger>
            <TabsTrigger 
              value="month" 
              className="text-xs px-2 h-7"
            >
              Month
            </TabsTrigger>
            <TabsTrigger 
              value="list" 
              className="text-xs px-2 h-7"
            >
              List
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
