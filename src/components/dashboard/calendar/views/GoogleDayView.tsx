
import React, { useMemo } from 'react';
import { format, isSameDay } from 'date-fns';
import { Order } from '@/hooks/useSampleOrders';

interface GoogleDayViewProps {
  date: Date;
  orders: Order[];
  photographers: Array<{id: number; name: string; color: string}>;
  selectedPhotographers: number[];
  onTimeSlotClick?: (time: string) => void;
}

export const GoogleDayView: React.FC<GoogleDayViewProps> = ({
  date,
  orders,
  photographers,
  selectedPhotographers,
  onTimeSlotClick
}) => {
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = 8; i <= 18; i++) {
      slots.push(`${i}:00`);
      slots.push(`${i}:30`);
    }
    return slots;
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      if (!order.scheduledDate) return false;
      const orderDate = new Date(order.scheduledDate);
      return isSameDay(orderDate, date) && selectedPhotographers.some(id => {
        const photographer = photographers.find(p => p.id === id);
        return photographer && order.photographer.includes(photographer.name);
      });
    });
  }, [orders, date, selectedPhotographers, photographers]);

  const handleTimeSlotClick = (time: string) => {
    if (onTimeSlotClick) {
      onTimeSlotClick(time);
    }
  };

  return (
    <div className="grid grid-cols-[50px_1fr] h-full">
      {/* Time slots */}
      <div className="border-r border-gray-200">
        {timeSlots.map(time => (
          <div key={time} className="h-12 flex items-center justify-center text-xs text-gray-500">
            {time}
          </div>
        ))}
      </div>

      {/* Events */}
      <div className="relative">
        {timeSlots.map(time => (
          <div 
            key={time} 
            className="h-12 border-b border-gray-200 last:border-none relative"
            onClick={() => handleTimeSlotClick(time)}
          >
            {filteredOrders.map(order => {
              if (!order.scheduledDate) return null;
              const orderDate = new Date(order.scheduledDate);
              const orderTime = format(orderDate, 'H:mm');

              if (orderTime === time) {
                const photographer = photographers.find(p => order.photographer.includes(p.name));
                const color = photographer?.color || 'gray';

                return (
                  <div
                    key={order.id}
                    className="absolute top-0 left-0 w-full h-12 bg-blue-100 border-l-4 border-blue-500 pl-2 text-sm overflow-hidden whitespace-nowrap overflow-ellipsis"
                    style={{borderColor: color}}
                  >
                    {order.client || 'Untitled'} - {order.photographer}
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
