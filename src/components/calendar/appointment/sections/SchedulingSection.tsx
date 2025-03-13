
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
  // Function to handle selecting a suggested time with its date
  const handleSuggestedTimeSelect = (time: string, date?: Date) => {
    onTimeChange(time);
    if (date) {
      onDateChange(date);
    }
  };

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
        onTimeSelect={(time) => onTimeChange(time)}
      />
      
      <DurationSelector
        selectedDuration={selectedDuration}
        onDurationChange={onDurationChange}
      />
    </ToggleSection>
  );
};
