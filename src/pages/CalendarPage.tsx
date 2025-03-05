
import { useState, useEffect, Suspense, lazy } from "react";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Plus, Users, Calendar, List, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CalendarSkeleton } from "@/components/dashboard/calendar/CalendarSkeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateAppointmentDialog } from "@/components/calendar/CreateAppointmentDialog";

// Lazy load the calendar component for better initial load performance
const JobCalendarWithErrorBoundary = lazy(() => 
  import("@/components/dashboard/JobCalendar").then(module => ({
    default: module.JobCalendarWithErrorBoundary
  }))
);

export function CalendarPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"month" | "week" | "day">("month");
  
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
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Team View
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Appointment
                </Button>
              </DialogTrigger>
              <CreateAppointmentDialog />
            </Dialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<CalendarSkeleton />}>
          <ErrorBoundary>
            <JobCalendarWithErrorBoundary calendarView={view} />
          </ErrorBoundary>
        </Suspense>
      </div>
    </SidebarLayout>
  );
}

// Adding default export for lazy loading
export default CalendarPage;
