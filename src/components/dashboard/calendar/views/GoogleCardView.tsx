
import React, { useMemo } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, User } from 'lucide-react';
import { CalendarOrder } from '@/types/calendar';

interface GoogleCardViewProps {
  date: Date;
  orders: CalendarOrder[];
  photographers: Array<{id: number; name: string; color: string}>;
  selectedPhotographers: number[];
  onCardClick?: (date: Date) => void;
}

export const GoogleCardView: React.FC<GoogleCardViewProps> = ({
  date,
  orders,
  photographers,
  selectedPhotographers,
  onCardClick
}) => {
  // Get the start of the current week
  const weekStart = useMemo(() => startOfWeek(date), [date]);
  
  // Filter orders for the current week
  const weekOrders = useMemo(() => {
    return orders
      .filter(order => {
        if (!order.scheduledDate) return false;
        const orderDate = new Date(order.scheduledDate);
        const weekEnd = addDays(weekStart, 6);
        return orderDate >= weekStart && orderDate <= weekEnd && 
          selectedPhotographers.some(id => {
            const photographer = photographers.find(p => p.id === id);
            return photographer && order.photographer.includes(photographer.name);
          });
      })
      .sort((a, b) => {
        if (!a.scheduledDate || !b.scheduledDate) return 0;
        return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
      });
  }, [orders, weekStart, selectedPhotographers, photographers]);

  // Group orders by day
  const ordersByDay = useMemo(() => {
    const grouped: { [key: string]: Order[] } = {};
    
    weekOrders.forEach(order => {
      if (!order.scheduledDate) return;
      
      const day = format(new Date(order.scheduledDate), 'yyyy-MM-dd');
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(order);
    });
    
    return grouped;
  }, [weekOrders]);

  // Get photogrpaher color
  const getPhotographerColor = (photographerName: string) => {
    const photographer = photographers.find(p => photographerName.includes(p.name));
    return photographer?.color || '#CBD5E0'; // Default gray color
  };

  // Check if a day is today
  const isToday = (dateStr: string) => {
    const today = new Date();
    return format(today, 'yyyy-MM-dd') === dateStr;
  };

  return (
    <div className="space-y-4 pb-20">
      {weekOrders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No appointments scheduled for this week
        </div>
      ) : (
        Object.entries(ordersByDay).map(([day, dayOrders]) => (
          <div key={day} className="space-y-2">
            <h3 className="text-sm font-medium flex items-center">
              {format(new Date(day), 'EEEE, MMMM d')}
              {isToday(day) && (
                <Badge variant="secondary" className="ml-2">Today</Badge>
              )}
            </h3>
            
            {dayOrders.map(order => {
              const orderDate = new Date(order.scheduledDate || '');
              const photographerColor = getPhotographerColor(order.photographer);
              const locationDisplay = order.location || order.address;
              
              return (
                <Card 
                  key={order.id} 
                  className="overflow-hidden" 
                  onClick={() => onCardClick && onCardClick(orderDate)}
                >
                  <div 
                    className="h-2" 
                    style={{ backgroundColor: photographerColor }}
                  />
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{order.client || 'Untitled Order'}</div>
                      <Badge variant="outline">{order.status}</Badge>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-500 space-y-1">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-2" />
                        {order.scheduledTime}
                      </div>
                      {locationDisplay && (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-2" />
                          {locationDisplay}
                        </div>
                      )}
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-2" />
                        {order.photographer}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};
