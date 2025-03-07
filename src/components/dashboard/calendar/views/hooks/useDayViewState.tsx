
import { useState } from 'react';

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
  
  return {
    timeSlots,
    generateHours
  };
}
