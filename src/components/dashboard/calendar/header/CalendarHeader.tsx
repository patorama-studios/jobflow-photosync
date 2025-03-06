
import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Clock, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CalendarHeaderProps {
  date: Date;
  view: "month" | "week" | "day" | "card";  // Updated type to include "card"
  appointmentCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: "month" | "week" | "day" | "card") => void;
  isMobileView?: boolean;
  restrictMobileViews?: boolean;
}

export const CalendarHeader = ({ 
  date, 
  view, 
  appointmentCount, 
  onPrevious, 
  onNext, 
  onToday, 
  onViewChange,
  isMobileView = false,
  restrictMobileViews = false
}: CalendarHeaderProps) => {
  const formattedDate = React.useMemo(() => {
    if (view === 'month') {
      return format(date, 'MMMM yyyy');
    } else if (view === 'week' || view === 'card') {
      return `Week of ${format(date, 'MMM d, yyyy')}`;
    } else {
      return format(date, 'EEEE, MMMM d, yyyy');
    }
  }, [date, view]);

  return (
    <div className={`border-b p-4 ${isMobileView ? 'grid gap-2' : 'flex justify-between items-center'}`}>
      <div className={`flex items-center ${isMobileView ? 'justify-between' : ''}`}>
        <h2 className="text-xl font-semibold flex items-center">
          {formattedDate}
          {appointmentCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {appointmentCount} {appointmentCount === 1 ? 'appointment' : 'appointments'}
            </Badge>
          )}
        </h2>
      </div>
      
      <div className={`flex items-center space-x-1 ${isMobileView ? 'justify-between mt-2' : ''}`}>
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="icon" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={onToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* View switcher - show limited views on mobile if restrictMobileViews is true */}
        {(!restrictMobileViews || !isMobileView) && (
          <div className={`flex items-center space-x-1 ${isMobileView ? 'ml-2' : 'ml-4'}`}>
            <Button
              variant={view === 'day' ? 'default' : 'outline'}
              size={isMobileView ? 'icon' : 'default'}
              onClick={() => onViewChange('day')}
              className={isMobileView ? 'p-2' : ''}
            >
              {isMobileView ? (
                <Clock className="h-4 w-4" />
              ) : (
                'Day'
              )}
            </Button>
            
            {(!restrictMobileViews || !isMobileView) && (
              <>
                <Button
                  variant={view === 'week' ? 'default' : 'outline'}
                  size={isMobileView ? 'icon' : 'default'}
                  onClick={() => onViewChange('week')}
                  className={isMobileView ? 'p-2' : ''}
                >
                  {isMobileView ? (
                    <Calendar className="h-4 w-4" />
                  ) : (
                    'Week'
                  )}
                </Button>
                
                <Button
                  variant={view === 'month' ? 'default' : 'outline'}
                  size={isMobileView ? 'icon' : 'default'}
                  onClick={() => onViewChange('month')}
                  className={isMobileView ? 'p-2' : ''}
                >
                  {isMobileView ? (
                    <CalendarDays className="h-4 w-4" />
                  ) : (
                    'Month'
                  )}
                </Button>
                
                {!isMobileView && (
                  <Button
                    variant={view === 'card' ? 'default' : 'outline'}
                    size={isMobileView ? 'icon' : 'default'}
                    onClick={() => onViewChange('card')}
                    className={isMobileView ? 'p-2' : ''}
                  >
                    {isMobileView ? (
                      <CalendarCheck className="h-4 w-4" />
                    ) : (
                      'Card'
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
