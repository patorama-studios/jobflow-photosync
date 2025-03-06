
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { CreateAppointmentDialog } from '@/components/calendar/CreateAppointmentDialog';
import { useToast } from '@/components/ui/use-toast';
import { GoogleCalendar } from '@/components/dashboard/calendar/GoogleCalendar';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize } from 'lucide-react';

const Calendar = () => {
  const [showCreateAppointment, setShowCreateAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [isFullScreen, setIsFullScreen] = useState(false);
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

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        toast({
          title: "Error",
          description: `Could not enable full-screen mode: ${err.message}`,
          variant: "destructive",
        });
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  return (
    <MainLayout showCalendarSubmenu={true}>
      <PageTransition>
        <div className="h-[calc(100vh-64px)] relative">
          {/* Fullscreen toggle button */}
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-2 right-2 z-10"
            onClick={toggleFullScreen}
          >
            {isFullScreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </Button>
          
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
