
import React, { memo, useMemo } from 'react';
import { Order } from '@/hooks/useSampleOrders';
import { format, isSameDay } from 'date-fns';
import { MapPin, Timer } from 'lucide-react';

interface DayViewProps {
  date: Date;
  orders: Order[];
  onTimeSlotClick?: (time: string) => void;
}

const TimeSlot = memo(({ hour, onTimeSlotClick }: { hour: number, onTimeSlotClick?: (time: string) => void }) => {
  const handleClick = () => {
    if (onTimeSlotClick) {
      const formattedHour = hour % 12 || 12;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      onTimeSlotClick(`${formattedHour}:00 ${ampm}`);
    }
  };

  return (
    <div 
      className="flex border-t border-gray-200 relative hover:bg-accent/30 cursor-pointer transition-colors"
      style={{ height: '60px' }}
      onClick={handleClick}
    >
      <div className="w-16 text-xs text-gray-500 -mt-2.5">{hour % 12 || 12}{hour >= 12 ? 'pm' : 'am'}</div>
      <div className="flex-1"></div>
    </div>
  );
});

TimeSlot.displayName = 'TimeSlot';

const DayAppointment = memo(({ job, startHour }: { job: Order, startHour: number }) => {
  const timeComponents = job.scheduledTime.split(':');
  const hour = parseInt(timeComponents[0], 10);
  const minute = parseInt(timeComponents[1].split(' ')[0], 10);
  const isPM = job.scheduledTime.includes('PM');
  
  const jobHour = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);
  const topPosition = ((jobHour - startHour) * 60 + minute) / 15;
  
  return (
    <div 
      className="absolute left-0 right-0 bg-primary/10 border-l-4 border-primary rounded-r-md px-2 py-1 truncate"
      style={{ 
        top: `${topPosition * 6}px`, 
        height: '80px',
        zIndex: 10,
      }}
    >
      <div className="text-xs font-medium">{job.scheduledTime} - {job.client}</div>
      <div className="text-xs flex items-center mt-1">
        <MapPin className="h-3 w-3 mr-1" />
        {job.address}
      </div>
      {job.drivingTimeMin && (
        <div className="text-xs flex items-center mt-1">
          <Timer className="h-3 w-3 mr-1" />
          {Math.floor(job.drivingTimeMin / 60)}h {job.drivingTimeMin % 60}m
        </div>
      )}
    </div>
  );
});

DayAppointment.displayName = 'DayAppointment';

export const DayView = memo(({ date, orders, onTimeSlotClick }: DayViewProps) => {
  const jobsForDay = useMemo(() => {
    return orders.filter(order => 
      order.scheduledDate && isSameDay(new Date(order.scheduledDate), date)
    ).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  }, [orders, date]);

  const startHour = 8;
  const endHour = 20;
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);
  
  return (
    <div className="day-view border rounded-md p-4 overflow-auto" style={{ height: 'calc(100vh - 250px)' }}>
      <h3 className="text-lg font-medium mb-4">{format(date, 'EEEE, MMMM d, yyyy')}</h3>
      
      <div className="relative">
        {hours.map(hour => (
          <TimeSlot key={hour} hour={hour} onTimeSlotClick={onTimeSlotClick} />
        ))}
        
        {jobsForDay.map(job => (
          <DayAppointment key={job.id} job={job} startHour={startHour} />
        ))}
      </div>
      
      {jobsForDay.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No appointments scheduled for this day
        </div>
      )}
    </div>
  );
});

DayView.displayName = 'DayView';
