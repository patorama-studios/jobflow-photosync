
import React, { useState, useEffect } from 'react';
import { Order } from '@/hooks/useSampleOrders';
import { format, isSameDay, addDays, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { usePhotographers } from '@/hooks/use-photographers';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CardViewProps {
  selectedDate: Date;
  orders: Order[];
  onOrderClick?: (order: Order) => void;
  onDayClick?: (date: Date) => void;
}

export const CardView: React.FC<CardViewProps> = ({ 
  selectedDate, 
  orders, 
  onOrderClick, 
  onDayClick 
}) => {
  const [startDate, setStartDate] = useState<Date>(startOfDay(selectedDate));
  const { photographers } = usePhotographers();
  const [daysToShow, setDaysToShow] = useState<Date[]>([]);
  const [ordersGroupedByDay, setOrdersGroupedByDay] = useState<Record<string, Order[]>>({});

  // Update days to show when selected date changes
  useEffect(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(startDate, i));
    }
    setDaysToShow(days);
  }, [startDate]);

  // Group orders by day
  useEffect(() => {
    const grouped: Record<string, Order[]> = {};
    
    daysToShow.forEach(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      grouped[dateKey] = orders.filter(order => {
        if (!order.scheduledDate) return false;
        return isSameDay(new Date(order.scheduledDate), day);
      });
    });
    
    setOrdersGroupedByDay(grouped);
  }, [orders, daysToShow]);

  // Handle navigation
  const handlePreviousWeek = () => {
    setStartDate(addDays(startDate, -7));
  };

  const handleNextWeek = () => {
    setStartDate(addDays(startDate, 7));
  };

  // Handle day click
  const handleDayClick = (date: Date) => {
    if (onDayClick) {
      onDayClick(date);
    }
  };

  // Get photographer color
  const getPhotographerColor = (photographerName: string): string => {
    const photographer = photographers.find(p => p.name === photographerName);
    return photographer?.color || '#6b7280'; // Default gray
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 py-2">
        <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          {format(startDate, 'MMM d')} - {format(addDays(startDate, 6), 'MMM d, yyyy')}
        </div>
        <Button variant="outline" size="sm" onClick={handleNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4">
          {daysToShow.map((day, dayIndex) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayOrders = ordersGroupedByDay[dateKey] || [];
            const isToday = isSameDay(day, new Date());
            
            return (
              <div 
                key={dateKey} 
                className={cn(
                  "rounded-lg border overflow-hidden",
                  isToday ? "border-primary" : "border-border"
                )}
              >
                <div 
                  className={cn(
                    "py-2 px-3 font-medium text-sm cursor-pointer",
                    isToday ? "bg-primary text-primary-foreground" : "bg-muted/30"
                  )}
                  onClick={() => handleDayClick(day)}
                >
                  {format(day, 'EEEE, MMMM d')}
                  <span className="text-xs ml-2 opacity-80">
                    {dayOrders.length} {dayOrders.length === 1 ? 'appointment' : 'appointments'}
                  </span>
                </div>
                
                {dayOrders.length === 0 ? (
                  <div 
                    className="p-4 text-center text-muted-foreground text-sm cursor-pointer hover:bg-muted/30"
                    onClick={() => handleDayClick(day)}
                  >
                    No appointments scheduled for this day
                  </div>
                ) : (
                  <div className="divide-y">
                    {dayOrders.map((order, orderIndex) => {
                      const photographerColor = getPhotographerColor(order.photographer);
                      
                      return (
                        <div 
                          key={`${dateKey}-${orderIndex}`}
                          className="p-3 hover:bg-muted/30 cursor-pointer"
                          onClick={() => onOrderClick && onOrderClick(order)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{order.scheduledTime}</div>
                            <div 
                              className="text-xs py-0.5 px-2 rounded-full" 
                              style={{ 
                                backgroundColor: `${photographerColor}20`,
                                color: photographerColor 
                              }}
                            >
                              {order.photographer}
                            </div>
                          </div>
                          <div className="mt-1">{order.customerName || order.client}</div>
                          <div className="text-sm text-muted-foreground truncate mt-0.5">
                            {order.propertyAddress || order.address}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
