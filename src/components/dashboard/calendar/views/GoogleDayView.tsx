
import React, { useMemo } from 'react';
import { format, isSameDay } from 'date-fns';
import { Order } from '@/hooks/useSampleOrders';
import { cn } from '@/lib/utils';

interface GoogleDayViewProps {
  date: Date;
  orders: Order[];
  photographers: { id: number; name: string; color: string; }[];
  selectedPhotographers: number[];
}

export const GoogleDayView: React.FC<GoogleDayViewProps> = ({
  date,
  orders,
  photographers,
  selectedPhotographers,
}) => {
  // Filter orders for the selected date
  const ordersForDay = useMemo(() => {
    return orders.filter(order => 
      order.scheduledDate && isSameDay(new Date(order.scheduledDate), date)
    );
  }, [orders, date]);

  // Generate time slots for the day view
  const timeSlots = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return {
        hour,
        display: `${hour12}:00 ${ampm}`,
        displayHalf: `${hour12}:30 ${ampm}`,
      };
    });
  }, []);

  // Map orders to photographers
  const ordersByPhotographer = useMemo(() => {
    const result: { [photographerId: number]: Order[] } = {};
    
    photographers.forEach(photographer => {
      result[photographer.id] = ordersForDay.filter(order => {
        // Match photographer name (in a real app, would use IDs)
        return order.photographer.includes(photographer.name);
      });
    });
    
    return result;
  }, [ordersForDay, photographers]);

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] bg-white border rounded-md">
      <div className="grid grid-cols-[100px_1fr] border-b">
        <div className="p-2 border-r"></div>
        <div className="grid" style={{ 
          gridTemplateColumns: `repeat(${selectedPhotographers.length}, 1fr)` 
        }}>
          {photographers
            .filter(p => selectedPhotographers.includes(p.id))
            .map(photographer => (
              <div 
                key={photographer.id}
                className="p-2 border-r text-center flex flex-col items-center gap-1"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: photographer.color }}
                >
                  {photographer.name.charAt(0)}
                </div>
                <div className="text-sm font-medium">{photographer.name}</div>
              </div>
            ))}
        </div>
      </div>
      
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
          
          <div className="relative grid" style={{ 
            gridTemplateColumns: `repeat(${selectedPhotographers.length}, 1fr)` 
          }}>
            {/* Grid lines */}
            {timeSlots.map(slot => (
              <React.Fragment key={slot.hour}>
                {selectedPhotographers.map(photographerId => (
                  <div 
                    key={`${slot.hour}-${photographerId}`} 
                    className="h-16 border-b border-r"
                  ></div>
                ))}
              </React.Fragment>
            ))}
            
            {/* Appointments */}
            {selectedPhotographers.map((photographerId, colIndex) => {
              const photographerOrders = ordersByPhotographer[photographerId] || [];
              const photographer = photographers.find(p => p.id === photographerId);
              
              return photographerOrders.map((order, idx) => {
                // Parse time to determine vertical position
                const timeStr = order.scheduledTime || '';
                const hourMatch = timeStr.match(/(\d+)(?::(\d+))?\s*(am|pm|AM|PM)/i);
                
                if (!hourMatch) return null;
                
                let orderHour = parseInt(hourMatch[1], 10);
                const orderMinute = parseInt(hourMatch[2] || '0', 10);
                const isPM = /pm/i.test(hourMatch[3]);
                
                if (isPM && orderHour !== 12) orderHour += 12;
                if (!isPM && orderHour === 12) orderHour = 0;
                
                // Duration in hours - default to 1 hour
                const durationHours = 1; 
                
                // Calculate top position
                const topPercentage = (orderHour + orderMinute / 60) * 16; // Each hour is 16px
                
                return (
                  <div
                    key={`${order.id}-${idx}`}
                    className={cn(
                      "absolute p-2 rounded overflow-hidden border-l-4 shadow-sm",
                      "min-h-[60px] hover:shadow-md transition-shadow z-10"
                    )}
                    style={{
                      top: `${topPercentage}px`,
                      height: `${durationHours * 16}px`,
                      left: `${(100 / selectedPhotographers.length) * colIndex}%`,
                      width: `calc(${100 / selectedPhotographers.length}% - 8px)`,
                      backgroundColor: `${photographer?.color}15`, // 15% opacity
                      borderLeftColor: photographer?.color
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
