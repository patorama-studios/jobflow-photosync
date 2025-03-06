
import React, { memo, useCallback } from 'react';
import { Badge } from "@/components/ui/badge";
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

export default JobCard;
