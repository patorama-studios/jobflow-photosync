
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { addDays } from 'date-fns';
import { TimeSelector } from './TimeSelector';
import { DurationSelector } from './DurationSelector';

interface AppointmentDetailsFormProps {
  formData: {
    date: Date | undefined;
    time: string;
    duration: number;
    notes: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    date: Date | undefined;
    time: string;
    duration: number;
    notes: string;
  }>>;
}

export const AppointmentDetailsForm: React.FC<AppointmentDetailsFormProps> = ({
  formData,
  setFormData
}) => {
  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      date
    }));
  };

  const handleTimeChange = (time: string) => {
    setFormData(prev => ({
      ...prev,
      time
    }));
  };

  const handleDurationChange = (duration: number) => {
    setFormData(prev => ({
      ...prev,
      duration
    }));
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      notes: e.target.value
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="date">Appointment Date</Label>
        <DatePicker 
          date={formData.date} 
          setDate={handleDateChange} 
        />
      </div>
      
      <div>
        <Label htmlFor="time">Appointment Time</Label>
        <TimeSelector 
          value={formData.time}
          onChange={handleTimeChange}
        />
      </div>
      
      <DurationSelector 
        value={formData.duration}
        onChange={handleDurationChange}
      />
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Add any additional notes here..."
          value={formData.notes}
          onChange={handleNotesChange}
        />
      </div>
    </div>
  );
};
