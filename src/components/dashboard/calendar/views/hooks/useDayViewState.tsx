
import { useState, useEffect, useMemo } from 'react';
import { Order } from '@/types/order-types';
import { isSameDay } from 'date-fns';
import { usePhotographers } from '@/hooks/use-photographers';

export function useDayViewState() {
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  
  // Generate time slots from 7 AM to 7 PM in 1-hour increments
  const generateHours = () => {
    const hours = [];
    for (let i = 7; i <= 19; i++) {
      const hour = i % 12 === 0 ? 12 : i % 12;
      const period = i < 12 ? 'AM' : 'PM';
      hours.push(`${hour}:00 ${period}`);
    }
    return hours;
  };

  // Fill timeSlots on component mount
  useEffect(() => {
    setTimeSlots(generateHours());
  }, []);
  
  return {
    timeSlots,
    generateHours
  };
}

export function usePhotographerEvents(date: Date, orders: Order[]) {
  const { photographers } = usePhotographers();
  
  // Group appointments by photographer for the selected day
  const photographerEvents = useMemo(() => {
    if (!date || !photographers.length || !orders.length) {
      return [];
    }
  
    // Filter orders to only include those for the selected date
    const ordersForDay = orders.filter(order => 
      order.scheduledDate && isSameDay(new Date(order.scheduledDate), date)
    );
  
    // Map photographers to their events for the day
    return photographers.map(photographer => {
      // Find all orders for this photographer
      const photographerOrders = ordersForDay.filter(
        order => order.photographer === photographer.name
      ).sort((a, b) => {
        // Sort by time (assuming scheduledTime is in format like "10:00 AM")
        return a.scheduledTime.localeCompare(b.scheduledTime);
      });
    
      return {
        photographer,
        orders: photographerOrders
      };
    }).filter(item => item.orders.length > 0 || item.photographer); // Keep all photographers for column display
  }, [date, photographers, orders]);

  return {
    photographerEvents,
    photographers
  };
}
