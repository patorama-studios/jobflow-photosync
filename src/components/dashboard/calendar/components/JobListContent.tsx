
import React, { memo } from 'react';
import { Order } from '@/types/order-types';
import JobCard from './JobCard';

interface JobListContentProps {
  jobs: Order[];
  onJobClick: (job: Order) => void;
}

const JobListContent = memo(({ jobs, onJobClick }: JobListContentProps) => {
  if (jobs.length === 0) {
    return (
      <p className="text-muted-foreground">No appointments scheduled for this day.</p>
    );
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {jobs.map((job: Order) => (
        <JobCard key={job.id} job={job} onClick={onJobClick} />
      ))}
    </div>
  );
});

JobListContent.displayName = 'JobListContent';

export default JobListContent;
