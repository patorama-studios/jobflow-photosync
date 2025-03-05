
import { useState, useEffect } from "react";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { JobCalendarWithErrorBoundary } from "@/components/dashboard/JobCalendar";
import { Bell, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function CalendarPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log("CalendarPage component mounted");
    
    // Use a short timeout to allow all resources to load
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("CalendarPage finished loading");
    }, 100);
    
    return () => {
      console.log("CalendarPage component unmounted");
      clearTimeout(timer);
    };
  }, []);

  return (
    <SidebarLayout showCalendarSubmenu={true} showBackButton={true}>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Calendar</h1>
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
        <JobCalendarWithErrorBoundary />
      </div>
    </SidebarLayout>
  );
}
