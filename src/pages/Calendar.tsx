
import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { JobCalendarWithErrorBoundary } from '@/components/dashboard/JobCalendar';
import { CreateAppointmentDialog } from '@/components/calendar/CreateAppointmentDialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Clock, LayoutGrid } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Calendar = () => {
  const [showCreateAppointment, setShowCreateAppointment] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month");
  const { toast } = useToast();

  useEffect(() => {
    // Log when the calendar view changes for debugging
    console.log("Calendar view changed to:", calendarView);
  }, [calendarView]);

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

  const handleViewChange = (value: string) => {
    setCalendarView(value as "month" | "week" | "day");
    
    toast({
      title: `Switched to ${value} view`,
      description: `You are now viewing the ${value} calendar.`,
      variant: "default",
    });
  };

  return (
    <MainLayout showCalendarSubmenu={true}>
      <PageTransition>
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Calendar</h1>
            <Tabs 
              defaultValue="month" 
              value={calendarView} 
              onValueChange={handleViewChange}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="month" className="flex items-center gap-1">
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Month</span>
                </TabsTrigger>
                <TabsTrigger value="week" className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Week</span>
                </TabsTrigger>
                <TabsTrigger value="day" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">Day</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <JobCalendarWithErrorBoundary 
            calendarView={calendarView}
            onTimeSlotClick={handleTimeSlotClick}
            onDayClick={handleDayClick}
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
