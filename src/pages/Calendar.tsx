
import React, { useState, useEffect } from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { JobCalendarWithErrorBoundary } from '@/components/dashboard/JobCalendar';
import { CreateAppointmentDialog } from '@/components/calendar/CreateAppointmentDialog';

const Calendar = () => {
  const [showCreateAppointment, setShowCreateAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  const handleTimeSlotClick = (time: string) => {
    setSelectedTime(time);
    setShowCreateAppointment(true);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setShowCreateAppointment(true);
  };

  return (
    <SidebarLayout showCalendarSubmenu={true} showBackButton={true}>
      <PageTransition>
        <div className="space-y-4">
          <JobCalendarWithErrorBoundary 
            calendarView="month"
            onTimeSlotClick={handleTimeSlotClick}
          />

          <CreateAppointmentDialog
            isOpen={showCreateAppointment}
            onClose={() => setShowCreateAppointment(false)}
            selectedDate={selectedDate || new Date()}
            selectedTime={selectedTime}
          />
        </div>
      </PageTransition>
    </SidebarLayout>
  );
};

export default Calendar;
