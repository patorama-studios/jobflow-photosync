
import React, { useState, useEffect } from 'react';
import { Order } from '@/hooks/useSampleOrders';
import { format, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { usePhotographers } from '@/hooks/use-photographers';
import { useDayViewState } from './hooks/useDayViewState';

interface DayViewProps {
  date: Date;
  orders: Order[];
  onTimeSlotClick?: (time: string) => void;
}

export const DayView: React.FC<DayViewProps> = ({ date, orders, onTimeSlotClick }) => {
  const { photographers } = usePhotographers();
  const dayViewState = useDayViewState();
  const [ordersGroupedByPhotographer, setOrdersGroupedByPhotographer] = useState<
    Record<string, { name: string, color: string, orders: Order[] }>
  >({});

  // Format the date for display
  const formattedDay = format(date, 'eeee');
  const formattedDate = format(date, 'MMMM d, yyyy');

  // Group orders by photographer
  useEffect(() => {
    const filteredOrders = orders.filter(order => {
      if (!order.scheduledDate) return false;
      
      const orderDate = new Date(order.scheduledDate);
      return (
        orderDate.getDate() === date.getDate() &&
        orderDate.getMonth() === date.getMonth() &&
        orderDate.getFullYear() === date.getFullYear()
      );
    });
    
    // Create groups with photographer information
    const groups: Record<string, { name: string, color: string, orders: Order[] }> = {};
    
    // Start with all photographers (even those without orders)
    photographers.forEach(photographer => {
      groups[photographer.name] = {
        name: photographer.name,
        color: photographer.color,
        orders: []
      };
    });
    
    // Then add orders to their respective photographers
    filteredOrders.forEach(order => {
      const photographerName = order.photographer;
      
      if (!groups[photographerName]) {
        // If the photographer doesn't exist in our list, add them
        const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        groups[photographerName] = {
          name: photographerName,
          color: randomColor,
          orders: []
        };
      }
      
      groups[photographerName].orders.push(order);
    });
    
    setOrdersGroupedByPhotographer(groups);
  }, [orders, date, photographers]);

  // Generate hours (timeslots)
  const hours = dayViewState.generateHours();

  // Handle time slot click
  const handleTimeSlotClick = (time: string) => {
    if (onTimeSlotClick) {
      onTimeSlotClick(time);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="text-center py-4">
        <h2 className={cn(
          "text-xl font-semibold", 
          isToday(date) && "text-primary"
        )}>
          {formattedDay}, {formattedDate}
        </h2>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="flex border-t">
          {/* Time column */}
          <div className="w-20 flex-shrink-0 border-r">
            <div className="sticky top-0 bg-background z-10 h-12 border-b"></div>
            {hours.map((hour, i) => (
              <div 
                key={`hour-${i}`} 
                className="h-16 border-b px-2 py-1 text-xs text-muted-foreground"
              >
                {hour}
              </div>
            ))}
          </div>
          
          {/* Photographer columns */}
          <div className="flex-1 flex">
            {Object.entries(ordersGroupedByPhotographer).map(([name, { color, orders }], index) => (
              <div 
                key={`photographer-${index}`} 
                className="flex-1 flex flex-col border-r min-w-[180px]"
              >
                {/* Photographer header */}
                <div className="sticky top-0 bg-background z-10 h-12 border-b flex items-center justify-center">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="font-medium truncate max-w-[150px]">{name}</span>
                  </div>
                </div>
                
                {/* Time slots */}
                {hours.map((hour, hourIndex) => {
                  // Find orders for this time slot
                  const ordersInThisSlot = orders.filter(order => {
                    const orderTime = order.scheduledTime;
                    return orderTime === hour;
                  });
                  
                  return (
                    <div 
                      key={`timeslot-${hourIndex}`} 
                      className={cn(
                        "h-16 border-b hover:bg-muted/50 relative",
                        ordersInThisSlot.length > 0 ? "cursor-default" : "cursor-pointer"
                      )}
                      onClick={() => {
                        if (ordersInThisSlot.length === 0) {
                          handleTimeSlotClick(hour);
                        }
                      }}
                    >
                      {ordersInThisSlot.map((order, orderIndex) => (
                        <div 
                          key={`order-${orderIndex}`}
                          className="absolute inset-1 rounded bg-primary/10 border border-primary/20 p-1 text-xs overflow-hidden"
                          style={{ backgroundColor: `${color}20` }}
                        >
                          <div className="font-medium truncate">{order.customerName || order.client}</div>
                          <div className="truncate">{order.propertyAddress || order.address}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
