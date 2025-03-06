
import React, { useMemo } from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { Order } from '@/hooks/useSampleOrders';
import { cn } from '@/lib/utils';

interface GoogleMonthViewProps {
  date: Date;
  orders: Order[];
  onSelectDate: (date: Date) => void;
}

export const GoogleMonthView: React.FC<GoogleMonthViewProps> = ({
  date,
  orders,
  onSelectDate,
}) => {
  // Generate days for the month view
  const days = useMemo(() => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    // Get days starting from the first day of the week of the month
    const calendarStart = startOfMonth(date);
    const firstDayOfWeek = calendarStart.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Adjust to start from Sunday (or Monday depending on locale)
    const adjustedStart = addDays(calendarStart, -firstDayOfWeek);
    
    // Generate 42 days (6 weeks) to ensure we cover the whole month plus surrounding days
    return eachDayOfInterval({ 
      start: adjustedStart, 
      end: addDays(adjustedStart, 41)
    });
  }, [date]);

  // Group orders by date
  const ordersByDate = useMemo(() => {
    const grouped: { [key: string]: Order[] } = {};
    
    orders.forEach(order => {
      if (!order.scheduledDate) return;
      
      const dateKey = format(new Date(order.scheduledDate), 'yyyy-MM-dd');
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push(order);
    });
    
    return grouped;
  }, [orders]);

  // Check if a day is closed
  const isDayClosed = (day: Date) => {
    // Example condition: weekends are closed
    return day.getDay() === 0; // Sunday
  };

  const handleDayClick = (day: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectDate(day);
  };

  return (
    <div className="bg-white border rounded-md shadow-sm">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((dayName, i) => (
          <div 
            key={dayName} 
            className="p-2 text-center text-sm font-medium text-gray-500"
          >
            {dayName}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 grid-rows-6 h-[calc(100vh-320px)]">
        {days.map((day, i) => {
          const isCurrentMonth = isSameMonth(day, date);
          const isSelectedDay = isSameDay(day, date);
          const isTodayDate = isToday(day);
          const dayKey = format(day, 'yyyy-MM-dd');
          const dayOrders = ordersByDate[dayKey] || [];
          const closed = isDayClosed(day);
          
          return (
            <div 
              key={i}
              className={cn(
                "border-r border-b p-1 relative overflow-hidden cursor-pointer",
                !isCurrentMonth && "bg-gray-50",
                isSelectedDay && "bg-blue-50",
              )}
              onClick={(e) => handleDayClick(day, e)}
            >
              <div className="flex justify-between">
                <div 
                  className={cn(
                    "text-sm w-6 h-6 flex items-center justify-center font-medium",
                    isTodayDate && "rounded-full bg-primary text-white",
                    !isTodayDate && isSelectedDay && "text-primary"
                  )}
                >
                  {format(day, 'd')}
                </div>
                
                {closed && (
                  <div className="text-xs bg-gray-200 px-1 rounded text-gray-700">
                    Closed
                  </div>
                )}
              </div>
              
              <div className="mt-1 space-y-1 max-h-[80%] overflow-hidden">
                {dayOrders.slice(0, 3).map((order, idx) => {
                  // Determine color based on the photographer or job type
                  let bgColor = "bg-blue-100 border-blue-500";
                  
                  if (order.photographer.includes("Emma")) {
                    bgColor = "bg-yellow-100 border-yellow-500";
                  } else if (order.photographer.includes("Michael")) {
                    bgColor = "bg-orange-100 border-orange-500";
                  } else if (order.photographer.includes("Sophia")) {
                    bgColor = "bg-pink-100 border-pink-500";
                  }
                  
                  // For unavailable blocks
                  if (order.status === "unavailable") {
                    bgColor = "bg-red-100 border-red-500";
                  }
                  
                  return (
                    <div 
                      key={`${order.id}-${idx}`}
                      className={`text-xs p-1 truncate border-l-2 rounded-r-sm ${bgColor}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle event click differently if needed
                      }}
                    >
                      {order.scheduledTime} {order.address.split(',')[0]}
                    </div>
                  );
                })}
                
                {dayOrders.length > 3 && (
                  <div className="text-xs text-gray-500 pl-1">
                    +{dayOrders.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
