
import { useState, useEffect, Suspense, lazy } from "react";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { Plus, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CalendarSkeleton } from "@/components/dashboard/calendar/CalendarSkeleton";

// Lazy load the calendar component for better initial load performance
const JobCalendarWithErrorBoundary = lazy(() => 
  import("@/components/dashboard/JobCalendar").then(module => ({
    default: module.JobCalendarWithErrorBoundary
  }))
);

export function CalendarPage() {
  const [isLoading, setIsLoading] = useState(true);
  
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
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            Team View
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<CalendarSkeleton />}>
          <ErrorBoundary>
            <JobCalendarWithErrorBoundary />
          </ErrorBoundary>
        </Suspense>
      </div>
    </SidebarLayout>
  );
}

// Adding default export for lazy loading
export default CalendarPage;
