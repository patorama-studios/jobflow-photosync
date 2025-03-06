
import React, { useMemo } from 'react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday } from 'date-fns';
import { Order } from '@/hooks/useSampleOrders';
import { cn } from '@/lib/utils';

interface GoogleWeekViewProps {
  date: Date;
  orders: Order[];
}

export const GoogleWeekView: React.FC<GoogleWeekViewProps> = ({
  date,
  orders,
}) => {
  // Generate days for the week view
  const days = useMemo(() => {
    const weekStart = startOfWeek(date, { weekStartsOn: 0 }); // 0 = Sunday
    return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  }, [date]);

  // Generate time slots for the day
  const timeSlots = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return {
        hour,
        display: `${hour12}:00 ${ampm}`,
      };
    });
  }, []);

  // Group orders by date
  const ordersByDate = useMemo(() => {
    const grouped: { [key: string]: Order[] } = {};
    
    days.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      grouped[dateKey] = [];
    });
    
    orders.forEach(order => {
      if (!order.scheduledDate) return;
      
      const orderDate = new Date(order.scheduledDate);
      const dateKey = format(orderDate, 'yyyy-MM-dd');
      
      // Only include if the date is in our week view
      if (grouped[dateKey] !== undefined) {
        grouped[dateKey].push(order);
      }
    });
    
    return grouped;
  }, [orders, days]);

  // Check if a day is closed
  const isDayClosed = (day: Date) => {
    // Example condition: Sundays and Saturdays are closed
    return day.getDay() === 0 || day.getDay() === 6;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-white border rounded-md">
      {/* Day headers */}
      <div className="grid grid-cols-[100px_1fr] border-b">
        <div className="border-r"></div>
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const isCurrentDay = isToday(day);
            const closed = isDayClosed(day);
            
            return (
              <div 
                key={i}
                className={cn(
                  "py-2 text-center border-r",
                  closed && "bg-gray-50"
                )}
              >
                <div className="text-sm text-gray-500">
                  {format(day, 'EEE')}
                </div>
                <div className={cn(
                  "text-lg font-semibold mx-auto w-8 h-8 flex items-center justify-center",
                  isCurrentDay ? "bg-primary text-white rounded-full" : ""
                )}>
                  {format(day, 'd')}
                </div>
                <div className="text-xs text-gray-500">
                  {format(day, 'MMM')}
                </div>
                {closed && (
                  <div className="mt-1 text-xs bg-gray-200 mx-auto w-16 px-1 rounded text-gray-700">
                    Closed
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[100px_1fr]">
          <div className="border-r">
            {timeSlots.map(slot => (
              <div key={slot.hour} className="h-16 border-b relative">
                <div className="absolute -top-2 right-2 text-xs text-gray-500">
                  {slot.display}
                </div>
              </div>
            ))}
          </div>
          
          <div className="relative grid grid-cols-7">
            {/* Grid lines */}
            {timeSlots.map(slot => (
              <React.Fragment key={slot.hour}>
                {days.map((day, dayIndex) => (
                  <div 
                    key={`${slot.hour}-${dayIndex}`}
                    className={cn(
                      "h-16 border-b border-r",
                      isDayClosed(day) && "bg-gray-50"
                    )}
                  ></div>
                ))}
              </React.Fragment>
            ))}
            
            {/* Appointments */}
            {days.map((day, dayIndex) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayOrders = ordersByDate[dateKey] || [];
              
              return dayOrders.map((order, idx) => {
                // Parse time to determine vertical position
                const timeStr = order.scheduledTime || '';
                const hourMatch = timeStr.match(/(\d+)(?::(\d+))?\s*(am|pm|AM|PM)/i);
                
                if (!hourMatch) return null;
                
                let orderHour = parseInt(hourMatch[1], 10);
                const orderMinute = parseInt(hourMatch[2] || '0', 10);
                const isPM = /pm/i.test(hourMatch[3]);
                
                if (isPM && orderHour !== 12) orderHour += 12;
                if (!isPM && orderHour === 12) orderHour = 0;
                
                // Example: Calculate duration from job type or assuming 1 hour
                const durationHours = 1;
                
                // Determine color based on the photographer or job type
                let bgColor = "bg-blue-100";
                let borderColor = "border-blue-500";
                
                if (order.photographer.includes("Emma")) {
                  bgColor = "bg-yellow-100";
                  borderColor = "border-yellow-500";
                } else if (order.photographer.includes("Michael")) {
                  bgColor = "bg-orange-100";
                  borderColor = "border-orange-500";
                } else if (order.photographer.includes("Sophia")) {
                  bgColor = "bg-pink-100";
                  borderColor = "border-pink-500";
                }
                
                // For unavailable blocks
                if (order.status === "unavailable") {
                  bgColor = "bg-red-100";
                  borderColor = "border-red-500";
                }
                
                // Calculate top position
                const topPercentage = (orderHour + orderMinute / 60) * 16; // Each hour is 16px
                
                return (
                  <div
                    key={`${order.id}-${idx}`}
                    className={cn(
                      "absolute p-2 rounded-sm overflow-hidden border-l-4 shadow-sm",
                      "hover:shadow-md transition-shadow z-10",
                      bgColor,
                      borderColor
                    )}
                    style={{
                      top: `${topPercentage}px`,
                      height: `${durationHours * 16}px`,
                      left: `${(100 / 7) * dayIndex}%`,
                      width: `calc(${100 / 7}% - 8px)`,
                    }}
                  >
                    <div className="text-xs font-medium">
                      {order.scheduledTime}
                    </div>
                    <div className="text-xs truncate">
                      {order.address.split(',')[0]}
                    </div>
                    {order.client && (
                      <div className="text-xs text-gray-600 truncate">
                        {order.client.split('-')[0].trim()}
                      </div>
                    )}
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
