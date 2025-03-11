
import React from 'react';
import { ToggleSection } from '../components/ToggleSection';
import { DateTimeSelector } from '../components/DateTimeSelector';
import { DurationSelector } from '../components/DurationSelector';
import { SuggestedTimes } from '../components/SuggestedTimes';

interface SchedulingSectionProps {
  selectedDateTime: Date | undefined;
  selectedTime: string;
  selectedDuration: number;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  onDurationChange: (duration: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export const SchedulingSection: React.FC<SchedulingSectionProps> = ({
  selectedDateTime,
  selectedTime,
  selectedDuration,
  onDateChange,
  onTimeChange,
  onDurationChange,
  isOpen,
  onToggle,
  isMobile
}) => {
  return (
    <ToggleSection 
      title="Scheduling" 
      isOpen={isOpen} 
      onToggle={onToggle}
    >
      <DateTimeSelector
        selectedDate={selectedDateTime}
        selectedTime={selectedTime}
        onDateChange={onDateChange}
        onTimeChange={onTimeChange}
        isMobile={isMobile}
      />
      
      <SuggestedTimes 
        selectedDate={selectedDateTime}
        onTimeSelect={onTimeChange}
      />
      
      <DurationSelector
        selectedDuration={selectedDuration}
        onDurationChange={onDurationChange}
      />
      
      {/* Using email as standard notification method */}
    </ToggleSection>
  );
};
