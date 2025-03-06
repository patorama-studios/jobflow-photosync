
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { CreateAppointmentDialog } from '@/components/calendar/CreateAppointmentDialog';
import { useToast } from '@/components/ui/use-toast';
import { GoogleCalendar } from '@/components/dashboard/calendar/GoogleCalendar';

const Calendar = () => {
  const [showCreateAppointment, setShowCreateAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const handleTimeSlotClick = (time: string) => {
    console.log("Time slot clicked:", time);
    setSelectedTime(time);
    setShowCreateAppointment(true);
  };

  const handleDayClick = (date: Date) => {
    console.log("Day clicked:", date);
    setSelectedDate(date);
    setShowCreateAppointment(true);
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="h-[calc(100vh-64px)]">
          <GoogleCalendar 
            onTimeSlotClick={handleTimeSlotClick}
            onDayClick={handleDayClick}
            defaultView="month"
          />
          
          <CreateAppointmentDialog
            isOpen={showCreateAppointment}
            onClose={() => setShowCreateAppointment(false)}
            selectedDate={selectedDate || new Date()}
            selectedTime={selectedTime}
          />
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Calendar;
