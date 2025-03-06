
import React from 'react';
import { Toolbar } from 'react-big-calendar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarToolbar = (props: any) => {
  const { onNavigate, label, onView, view } = props;

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onNavigate('PREV')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onNavigate('TODAY')}
        >
          Today
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onNavigate('NEXT')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <h2 className="text-lg font-medium">{label}</h2>
      
      <div className="flex space-x-2">
        <Button 
          variant={view === 'month' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => onView('month')}
        >
          Month
        </Button>
        <Button 
          variant={view === 'week' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => onView('week')}
        >
          Week
        </Button>
        <Button 
          variant={view === 'day' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => onView('day')}
        >
          Day
        </Button>
        <Button 
          variant={view === 'agenda' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => onView('agenda')}
        >
          Agenda
        </Button>
      </div>
    </div>
  );
};
