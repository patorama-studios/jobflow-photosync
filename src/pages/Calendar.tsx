
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { CreateAppointmentDialog } from '@/components/calendar/CreateAppointmentDialog';
import { useToast } from '@/components/ui/use-toast';
import { GoogleCalendar } from '@/components/dashboard/calendar/GoogleCalendar';

const Calendar = () => {
  const [showCreateAppointment, setShowCreateAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <MainLayout showCalendarSubmenu={false}>
      <PageTransition>
        <div className="h-[calc(100vh-64px)] w-full">
          <GoogleCalendar 
            onTimeSlotClick={handleTimeSlotClick}
            onDayClick={handleDayClick}
            defaultView="month"
            onToggleFullscreen={toggleFullscreen}
            isFullscreen={isFullscreen}
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
