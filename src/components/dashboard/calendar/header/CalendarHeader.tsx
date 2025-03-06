import React from 'react';
import { format, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar as CalendarIcon,
  LayoutList,
  CalendarIcon as CalendarCheck
} from 'lucide-react';

interface CalendarHeaderProps {
  date: Date;
  view: "month" | "week" | "day";
  appointmentCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: "month" | "week" | "day") => void;
  isMobileView?: boolean;
  restrictMobileViews?: boolean;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  date,
  view,
  appointmentCount,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  isMobileView = false,
  restrictMobileViews = false
}) => {
  const handleViewChange = (newView: "month" | "week" | "day") => {
    onViewChange(newView);
  };

  return (
    <Card className="mb-4">
      <Card className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {/* Mobile View: Show only Today button */}
          {isMobileView ? (
            <Button size="sm" onClick={onToday}>
              Today
            </Button>
          ) : (
            <>
              <Button size="sm" onClick={onPrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={onNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={onToday}>
                Today
              </Button>
            </>
          )}
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold">{format(date, 'MMMM yyyy')}</h2>
          <div className="text-sm text-muted-foreground">
            <Clock className="h-4 w-4 inline-block mr-1" />
            {appointmentCount} Appointments
          </div>
        </div>

        {/* Mobile View: Hide Tabs */}
        {!isMobileView && (
          <Tabs defaultValue={view} className="w-[300px]" onValueChange={handleViewChange}>
            <TabsList>
              <TabsTrigger value="month" disabled={restrictMobileViews}>
                <CalendarDays className="h-4 w-4 mr-2" />
                Month
              </TabsTrigger>
              <TabsTrigger value="week" disabled={restrictMobileViews}>
                <LayoutList className="h-4 w-4 mr-2" />
                Week
              </TabsTrigger>
              <TabsTrigger value="day">
                <CalendarCheck className="h-4 w-4 mr-2" />
                Day
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </Card>
    </Card>
  );
};
