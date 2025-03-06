
import React, { useMemo, memo, useCallback } from 'react';
import { isSameDay } from "date-fns";
import { Order } from '@/types/order-types';
import JobListHeader from './components/JobListHeader';
import JobListContent from './components/JobListContent';

interface JobListProps {
  selectedDate: Date | undefined;
  orders: Order[];
}

export function JobList({ selectedDate, orders }: JobListProps) {
  // Memoize the jobs for the selected date to avoid filtering on every render
  const jobsForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    
    return orders.filter(order => 
      order.scheduledDate && isSameDay(new Date(order.scheduledDate), selectedDate)
    ).sort((a, b) => {
      // Sort by time (assuming scheduledTime is in format like "10:00 AM")
      return a.scheduledTime.localeCompare(b.scheduledTime);
    });
  }, [orders, selectedDate]);

  const handleJobClick = useCallback((job: Order) => {
    // We could add functionality here to show job details
    console.log('Job clicked:', job);
  }, []);

  if (!selectedDate) {
    return <p>Please select a date to view appointments</p>;
  }

  return (
    <div>
      <JobListHeader 
        selectedDate={selectedDate} 
        jobCount={jobsForSelectedDay.length} 
      />
      
      <JobListContent 
        jobs={jobsForSelectedDay}
        onJobClick={handleJobClick}
      />
    </div>
  );
}

// Export with memo for better performance
export default memo(JobList);
