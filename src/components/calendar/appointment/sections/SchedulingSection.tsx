
import React from 'react';
import { ToggleSection } from '../components/ToggleSection';
import { DateTimeSelector } from '../components/DateTimeSelector';
import { DurationSelector } from '../components/DurationSelector';
import { NotificationSelector } from '../components/NotificationSelector';

interface SchedulingSectionProps {
  selectedDateTime: Date | undefined;
  selectedTime: string;
  selectedDuration: string;
  selectedNotification: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  onDurationChange: (duration: string) => void;
  onNotificationMethodChange: (method: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export const SchedulingSection: React.FC<SchedulingSectionProps> = ({
  selectedDateTime,
  selectedTime,
  selectedDuration,
  selectedNotification,
  onDateChange,
  onTimeChange,
  onDurationChange,
  onNotificationMethodChange,
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
      
      <DurationSelector
        selectedDuration={selectedDuration}
        onDurationChange={onDurationChange}
      />
      
      <NotificationSelector 
        onNotificationMethodChange={onNotificationMethodChange}
        defaultMethod={selectedNotification}
      />
    </ToggleSection>
  );
};
