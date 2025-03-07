
import React from 'react';
import { useDayViewState, usePhotographerEvents } from './hooks/useDayViewState';
import { Order } from '@/types/order-types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import JobCard from '../components/JobCard';

interface DayViewProps {
  date: Date;
  orders: Order[];
  onTimeSlotClick?: (time: string) => void;
}

export function DayView({ date, orders, onTimeSlotClick }: DayViewProps) {
  const { timeSlots } = useDayViewState();
  const { photographerEvents, photographers } = usePhotographerEvents(date, orders);

  const handleTimeSlotClick = (time: string) => {
    if (onTimeSlotClick) onTimeSlotClick(time);
  };

  if (!date) {
    return <div className="p-4">Please select a date to view appointments</div>;
  }

  return (
    <div className="h-full overflow-auto">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold">{format(date, 'EEEE, MMMM d, yyyy')}</h2>
      </div>

      <div className="grid grid-cols-[auto_repeat(auto-fill,minmax(220px,1fr))] gap-2">
        {/* Time column */}
        <div className="pr-2 border-r">
          <div className="h-14 flex items-end pb-2">
            <span className="text-xs text-muted-foreground">Time</span>
          </div>
          
          {timeSlots.map((time) => (
            <div 
              key={time} 
              className="h-16 flex items-center text-xs text-muted-foreground pr-2 hover:bg-accent/20 cursor-pointer"
              onClick={() => handleTimeSlotClick(time)}
            >
              {time}
            </div>
          ))}
        </div>

        {/* Photographer columns */}
        {photographers.map((photographer) => {
          const photoEvents = photographerEvents.find(pe => pe.photographer.id === photographer.id);
          const photographerOrders = photoEvents?.orders || [];
          
          return (
            <div key={photographer.id} className="min-w-[220px]">
              <div className="h-14 flex flex-col items-center justify-end pb-2 border-b">
                <div className="text-sm font-medium">{photographer.name}</div>
                <div className="flex items-center">
                  <span 
                    className="w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: photographer.color }}
                  ></span>
                  <Badge variant="outline" className="text-xs">
                    {photographerOrders.length} job{photographerOrders.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2 p-1">
                {photographerOrders.map((order) => (
                  <div key={order.id} className="relative">
                    <JobCard job={order} onClick={() => {}} />
                  </div>
                ))}
                
                {photographerOrders.length === 0 && (
                  <div className="h-16 text-center text-xs text-muted-foreground flex items-center justify-center">
                    No appointments
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
