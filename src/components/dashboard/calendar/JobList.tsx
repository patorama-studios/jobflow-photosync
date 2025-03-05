
import React, { useMemo, memo } from 'react';
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { Order } from '@/hooks/useSampleOrders';

interface JobCardProps {
  job: Order;
}

// Memoized JobCard for better performance
const JobCard = memo(({ job }: JobCardProps) => {
  return (
    <div className="p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
      <div className="flex justify-between">
        <p className="font-medium">{job.orderNumber}</p>
        <span className="text-sm text-muted-foreground">{job.scheduledTime}</span>
      </div>
      <p className="text-sm text-muted-foreground">{job.address}</p>
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
    );
  }, [orders, selectedDate]);

  // Memoize the formatted date
  const formattedDate = useMemo(() => {
    return selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected';
  }, [selectedDate]);

  if (!selectedDate) {
    return <p>Please select a date to view appointments</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{formattedDate}</h3>
      
      {jobsForSelectedDay.length === 0 ? (
        <p className="text-muted-foreground">No appointments scheduled for this day.</p>
      ) : (
        <div className="space-y-4">
          {jobsForSelectedDay.map((job: Order) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
