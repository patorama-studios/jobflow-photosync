
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, RefreshCw, Maximize, Minimize } from 'lucide-react';
import { format, addDays, addMonths, subMonths, isToday } from 'date-fns';

interface CalendarHeaderProps {
  date: Date;
  view: "month" | "week" | "day";
  appointmentCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: "month" | "week" | "day") => void;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  date,
  view,
  appointmentCount,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  onToggleFullscreen,
  isFullscreen = false,
}) => {
  const getTitle = () => {
    if (view === "day") {
      return format(date, 'EEEE, d MMMM yyyy');
    } else if (view === "week") {
      const endOfWeek = addDays(date, 6);
      const sameMonth = date.getMonth() === endOfWeek.getMonth();
      
      if (sameMonth) {
        return `${format(date, 'd')} - ${format(endOfWeek, 'd MMMM yyyy')}`;
      } else {
        return `${format(date, 'd MMMM')} - ${format(endOfWeek, 'd MMMM yyyy')}`;
      }
    } else {
      return format(date, 'MMMM yyyy');
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-t-md">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-2 h-9"
          onClick={onToday}
        >
          Today
        </Button>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <h2 className="text-lg font-semibold">{getTitle()}</h2>
        
        {appointmentCount > 0 && (
          <span className="text-sm text-muted-foreground">
            {appointmentCount} Appointment{appointmentCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-white rounded-md border">
          <Button 
            variant={view === "month" ? "default" : "ghost"} 
            size="sm" 
            className={`rounded-r-none ${view === "month" ? "" : "hover:bg-gray-100"}`}
            onClick={() => onViewChange("month")}
          >
            Month
          </Button>
          <Button 
            variant={view === "week" ? "default" : "ghost"} 
            size="sm" 
            className={`rounded-none ${view === "week" ? "" : "hover:bg-gray-100"}`}
            onClick={() => onViewChange("week")}
          >
            Week
          </Button>
          <Button 
            variant={view === "day" ? "default" : "ghost"} 
            size="sm" 
            className={`rounded-l-none ${view === "day" ? "" : "hover:bg-gray-100"}`}
            onClick={() => onViewChange("day")}
          >
            Day
          </Button>
        </div>
        
        {onToggleFullscreen && (
          <Button variant="ghost" size="icon" onClick={onToggleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        )}
        
        <Button variant="ghost" size="icon" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
