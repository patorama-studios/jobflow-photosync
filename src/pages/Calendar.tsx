
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { CreateAppointmentDialog } from '@/components/calendar/CreateAppointmentDialog';
import { useToast } from '@/components/ui/use-toast';
import { GoogleCalendar } from '@/components/dashboard/calendar/GoogleCalendar';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize, Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Calendar = () => {
  const [showCreateAppointment, setShowCreateAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<"day" | "card">("day");

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
          {/* Mobile create appointment button - with compact header */}
          {isMobile && (
            <div className="sticky top-0 z-10 bg-background shadow-sm border-b py-2">
              <div className="flex items-center justify-between px-4">
                <Button 
                  className="flex items-center justify-center gap-2 py-2 flex-1 mr-2"
                  onClick={() => setShowCreateAppointment(true)}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  New Order
                </Button>
                <div className="flex space-x-1">
                  <Button
                    variant={mobileView === 'day' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMobileView('day')}
                    className="p-2"
                  >
                    <Clock className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={mobileView === 'card' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setMobileView('card')}
                    className="p-2"
                  >
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Fullscreen toggle button - only show on desktop */}
          {!isMobile && (
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
          )}
          
          <GoogleCalendar 
            onTimeSlotClick={handleTimeSlotClick}
            onDayClick={handleDayClick}
            defaultView={isMobile ? mobileView : "month"}
            isMobileView={isMobile}
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
