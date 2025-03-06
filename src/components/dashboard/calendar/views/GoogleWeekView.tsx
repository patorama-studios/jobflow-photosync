
import React from 'react';
import { Order } from '@/hooks/useSampleOrders';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface GoogleWeekViewProps {
  date: Date;
  orders: Order[];
  onTimeSlotClick?: (time: string) => void;
}

// Generate time slots from 8 AM to 8 PM
const timeSlots = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 8;
  return hour < 12 ? `${hour}:00 AM` : hour === 12 ? `12:00 PM` : `${hour - 12}:00 PM`;
});

export const GoogleWeekView: React.FC<GoogleWeekViewProps> = ({
  date,
  orders,
  onTimeSlotClick
}) => {
  // Get the start of the week (Sunday)
  const startDate = startOfWeek(date);
  
  // Generate days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  // Format day headers
  const dayHeaders = weekDays.map(day => ({
    date: day,
    dayName: format(day, 'EEE'),
    dayNumber: format(day, 'd'),
  }));

  // Get appointments for each day and time slot
  const getAppointmentsForSlot = (day: Date, timeSlot: string) => {
    return orders.filter(order => {
      if (!order.scheduledDate) return false;
      
      const orderDate = new Date(order.scheduledDate);
      const orderTime = format(orderDate, 'h:mm a');
      
      return isSameDay(orderDate, day) && orderTime === timeSlot;
    });
  };

  // Handle time slot click
  const handleTimeSlotClick = (time: string) => {
    if (onTimeSlotClick) {
      onTimeSlotClick(time);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Week header */}
      <div className="grid grid-cols-8 border-b">
        {/* Empty cell for time column */}
        <div className="p-2 border-r bg-gray-50"></div>
        
        {/* Day headers */}
        {dayHeaders.map((day, index) => (
          <div 
            key={index} 
            className={cn(
              "p-2 text-center border-r",
              isSameDay(day.date, new Date()) ? "bg-blue-50" : "bg-gray-50"
            )}
          >
            <div className="font-medium">{day.dayName}</div>
            <div className={cn(
              "inline-flex items-center justify-center w-8 h-8 rounded-full",
              isSameDay(day.date, new Date()) ? "bg-blue-500 text-white" : ""
            )}>
              {day.dayNumber}
            </div>
          </div>
        ))}
      </div>
      
      {/* Time slots */}
      <div className="flex-1 overflow-y-auto">
        {timeSlots.map((time, timeIndex) => (
          <div key={timeIndex} className="grid grid-cols-8 border-b">
            {/* Time column */}
            <div className="p-2 border-r text-right text-sm text-gray-500">
              {time}
            </div>
            
            {/* Day columns */}
            {weekDays.map((day, dayIndex) => {
              const appointments = getAppointmentsForSlot(day, time);
              
              return (
                <div 
                  key={dayIndex} 
                  className={cn(
                    "p-1 border-r min-h-[60px] relative",
                    isSameDay(day, new Date()) ? "bg-blue-50/30" : ""
                  )}
                  onClick={() => handleTimeSlotClick(time)}
                >
                  {appointments.length > 0 ? (
                    appointments.map((appointment, i) => (
                      <div 
                        key={i}
                        className="bg-blue-100 border-l-4 border-blue-500 p-1 mb-1 text-xs rounded"
                        title={appointment.client || 'Unnamed'}
                      >
                        <div className="font-medium truncate">{appointment.client || 'Unnamed'}</div>
                        <div className="truncate">{appointment.package || 'Service'}</div>
                      </div>
                    ))
                  ) : (
                    <div className="w-full h-full cursor-pointer hover:bg-gray-100/50 rounded"></div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
