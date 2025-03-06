
import React, { useMemo, memo, useCallback } from 'react';
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { Order } from '@/types/order-types';
import { CalendarClock, MapPin, Timer } from 'lucide-react';

interface JobCardProps {
  job: Order;
  onClick?: (job: Order) => void;
}

// Memoized JobCard for better performance
const JobCard = memo(({ job, onClick }: JobCardProps) => {
  const handleClick = useCallback(() => {
    if (onClick) onClick(job);
  }, [job, onClick]);

  return (
    <div 
      className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <div className="flex justify-between">
        <p className="font-medium">{job.orderNumber}</p>
        <span className="text-sm text-muted-foreground flex items-center">
          <CalendarClock className="h-3.5 w-3.5 mr-1" />
          {job.scheduledTime}
        </span>
      </div>
      <p className="text-sm text-muted-foreground flex items-center">
        <MapPin className="h-3.5 w-3.5 mr-1" />
        {job.address}
      </p>
      {job.drivingTimeMin && (
        <p className="text-sm text-muted-foreground flex items-center">
          <Timer className="h-3.5 w-3.5 mr-1" />
          {Math.floor(job.drivingTimeMin / 60)}h {job.drivingTimeMin % 60}m
          {job.previousLocation && <span className="ml-1">from {job.previousLocation}</span>}
        </p>
      )}
      <div className="flex items-center mt-2">
        <div className="flex-1">
          <p className="text-sm">{job.client}</p>
        </div>
        <Badge variant={job.status === 'completed' ? 'success' : 'default'}>
          {job.status}
        </Badge>
      </div>
    </div>
  );
});

// Set display name for React DevTools
JobCard.displayName = 'JobCard';

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

  // Memoize the formatted date
  const formattedDate = useMemo(() => {
    return selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected';
  }, [selectedDate]);

  const handleJobClick = useCallback((job: Order) => {
    // We could add functionality here to show job details
    console.log('Job clicked:', job);
  }, []);

  if (!selectedDate) {
    return <p>Please select a date to view appointments</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <span>{formattedDate}</span>
        {jobsForSelectedDay.length > 0 && (
          <Badge variant="outline" className="ml-2">
            {jobsForSelectedDay.length} job{jobsForSelectedDay.length !== 1 ? 's' : ''}
          </Badge>
        )}
      </h3>
      
      {jobsForSelectedDay.length === 0 ? (
        <p className="text-muted-foreground">No appointments scheduled for this day.</p>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {jobsForSelectedDay.map((job: Order) => (
            <JobCard key={job.id} job={job} onClick={handleJobClick} />
          ))}
        </div>
      )}
    </div>
  );
}

// Export with memo for better performance
export default memo(JobList);
