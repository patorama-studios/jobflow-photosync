
// This is a new file I'm creating to check the current implementation
// Add console logs to debug the mounting/rendering of the component

import React, { useEffect } from 'react';

export function JobCalendar() {
  useEffect(() => {
    console.log("JobCalendar component mounted");
    
    return () => {
      console.log("JobCalendar component unmounted");
    };
  }, []);

  console.log("Rendering JobCalendar component");
  
  return (
    <div className="bg-card rounded-lg shadow p-4">
      <div className="text-lg font-medium mb-4">Calendar (Debug Version)</div>
      <p>This is a debug version of the calendar to troubleshoot loading issues.</p>
      <p>If you see this message, the calendar component is mounting correctly.</p>
    </div>
  );
}
