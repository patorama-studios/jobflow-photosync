
import { PageTransition } from "@/components/layout/PageTransition";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { JobCalendar } from "@/components/dashboard/JobCalendar";
import { Bell, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CalendarPage() {
  console.log("Rendering CalendarPage component");
  
  return (
    <SidebarLayout>
      <PageTransition>
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
          <JobCalendar />
        </div>
      </PageTransition>
    </SidebarLayout>
  );
}
