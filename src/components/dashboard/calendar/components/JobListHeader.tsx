
import React, { memo, useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface JobListHeaderProps {
  selectedDate: Date | undefined;
  jobCount: number;
}

const JobListHeader = memo(({ selectedDate, jobCount }: JobListHeaderProps) => {
  // Memoize the formatted date
  const formattedDate = useMemo(() => {
    return selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'No date selected';
  }, [selectedDate]);

  return (
    <h3 className="text-lg font-medium mb-4 flex items-center">
      <span>{formattedDate}</span>
      {jobCount > 0 && (
        <Badge variant="outline" className="ml-2">
          {jobCount} job{jobCount !== 1 ? 's' : ''}
        </Badge>
      )}
    </h3>
  );
});

JobListHeader.displayName = 'JobListHeader';

export default JobListHeader;
