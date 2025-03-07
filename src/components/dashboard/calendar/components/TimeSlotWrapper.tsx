
import React from 'react';

export const TimeSlotWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="group transition-colors hover:bg-accent/30 h-full">
      {children}
    </div>
  );
};
