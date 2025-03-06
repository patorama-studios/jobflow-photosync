
import React from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
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
  // Filter orders for current week
  const filteredOrders = orders.filter(order => {
    if (!order.scheduled_date) return false;
    const orderDate = parseISO(order.scheduled_date);
    return orderDate >= date && orderDate < new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
  });

  // Sort orders by date and time
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.scheduled_date);
    const dateB = new Date(b.scheduled_date);
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    return a.scheduled_time.localeCompare(b.scheduled_time);
  });

  const getPhotographerColor = (photographerName: string): string => {
    if (!photographerName) return '#CBD5E0'; // Default gray
    const photographer = photographers.find(p => 
      selectedPhotographers.includes(p.id) && photographerName.includes(p.name)
    );
    return photographer ? photographer.color : '#CBD5E0';
  };

  if (sortedOrders.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No appointments scheduled for this week
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedOrders.map((order) => {
        const orderDate = parseISO(order.scheduled_date);
        const isToday = isSameDay(orderDate, new Date());
        const photographerColor = getPhotographerColor(order.photographer || '');
        
        return (
          <Card 
            key={order.id} 
            className={`border-l-4 hover:shadow-md transition-shadow cursor-pointer ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`} 
            style={{ borderLeftColor: photographerColor }}
            onClick={() => onCardClick && onCardClick(orderDate)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-sm">
                    {format(orderDate, 'EEE, MMM d')} • {order.scheduled_time}
                  </h4>
                  <p className="text-lg font-bold mt-1">{order.client}</p>
                </div>
                <Badge variant={isToday ? "default" : "outline"}>
                  {order.package}
                </Badge>
              </div>
              
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1.5" />
                  <span className="truncate">{order.address}</span>
                </div>
                {order.photographer && (
                  <div className="flex items-center">
                    <User className="h-3.5 w-3.5 mr-1.5" />
                    <span>{order.photographer}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  <span>{order.scheduled_time}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
