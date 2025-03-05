
import { useState, useEffect, Suspense, lazy } from "react";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Plus, Calendar, List, LayoutDashboard, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CalendarSkeleton } from "@/components/dashboard/calendar/CalendarSkeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateAppointmentDialog } from "@/components/calendar/CreateAppointmentDialog";
import { addDays, addWeeks, format, subDays, subWeeks } from "date-fns";

// Lazy load the calendar component for better initial load performance
const JobCalendarWithErrorBoundary = lazy(() => 
  import("@/components/dashboard/JobCalendar").then(module => ({
    default: module.JobCalendarWithErrorBoundary
  }))
);

export function CalendarPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  
  useEffect(() => {
    console.log("CalendarPage component mounted");
    
    // Use requestAnimationFrame for smoother loading transition
    const timer = requestAnimationFrame(() => {
      setIsLoading(false);
      console.log("CalendarPage finished loading");
    });
    
    return () => {
      console.log("CalendarPage component unmounted");
      cancelAnimationFrame(timer);
    };
  }, []);

  const handleViewChange = (value: string) => {
    setView(value as "month" | "week" | "day");
    console.log(`Calendar view changed to: ${value}`);
  };

  const handleOpenDialog = (time?: string) => {
    setTimeSlot(time || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeSlot(null);
  };

  const navigatePrevious = () => {
    if (view === "day") {
      setSelectedDate(prev => subDays(prev, 1));
    } else if (view === "week") {
      setSelectedDate(prev => subWeeks(prev, 1));
    }
  };

  const navigateNext = () => {
    if (view === "day") {
      setSelectedDate(prev => addDays(prev, 1));
    } else if (view === "week") {
      setSelectedDate(prev => addWeeks(prev, 1));
    }
  };

  return (
    <SidebarLayout showCalendarSubmenu={true} showBackButton={true}>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-2">
            <Calendar className="h-7 w-7 text-primary" />
            Calendar
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your shooting schedule and appointments
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-4">
          <Tabs value={view} onValueChange={handleViewChange} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="month">
                <Calendar className="h-4 w-4 mr-2" />
                Month
              </TabsTrigger>
              <TabsTrigger value="week">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Week
              </TabsTrigger>
              <TabsTrigger value="day">
                <List className="h-4 w-4 mr-2" />
                Day
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex space-x-3">
            {(view === 'day' || view === 'week') && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={navigatePrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  {view === 'day' 
                    ? format(selectedDate, 'MMM d, yyyy')
                    : `Week of ${format(selectedDate, 'MMM d')}`}
                </span>
                <Button variant="outline" size="icon" onClick={navigateNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Appointment
                </Button>
              </DialogTrigger>
              <CreateAppointmentDialog 
                isOpen={isDialogOpen} 
                onClose={handleCloseDialog} 
                selectedDate={selectedDate}
                selectedTime={timeSlot || undefined}
              />
            </Dialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<CalendarSkeleton />}>
          <ErrorBoundary>
            <JobCalendarWithErrorBoundary 
              calendarView={view} 
              onTimeSlotClick={handleOpenDialog}
            />
          </ErrorBoundary>
        </Suspense>
      </div>
    </SidebarLayout>
  );
}

// Adding default export for lazy loading
export default CalendarPage;
