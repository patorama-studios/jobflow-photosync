
import { Calendar as CalendarIcon, MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";

// Sample job data
const jobs = [
  {
    id: 1,
    title: "Luxury Beachfront Property",
    client: "Ocean View Realty",
    time: "9:00 AM - 11:00 AM",
    address: "123 Coastal Way, Beachside",
    status: "confirmed"
  },
  {
    id: 2,
    title: "Modern Downtown Apartment",
    client: "Urban Living Properties",
    time: "1:00 PM - 2:30 PM",
    address: "456 City Center Blvd, Downtown",
    status: "pending"
  },
  {
    id: 3,
    title: "Suburban Family Home",
    client: "Hometown Realty",
    time: "3:30 PM - 5:00 PM",
    address: "789 Maple Street, Suburbia",
    status: "confirmed"
  }
];

export function JobCalendar() {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Today's Schedule</CardTitle>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <CalendarIcon className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
            <Button size="sm" variant="default">
              <Plus className="h-4 w-4 mr-2" />
              New Job
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {jobs.map((job) => (
            <GlassCard 
              key={job.id} 
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border/60"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    job.status === 'confirmed' ? 'bg-green-500' : 'bg-amber-500'
                  }`}></div>
                  <h3 className="font-medium">{job.title}</h3>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-3">
                    <span>{job.client}</span>
                    <span className="hidden md:inline">•</span>
                    <span>{job.time}</span>
                  </div>
                  <div className="mt-1">
                    {job.address}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 mt-4 md:mt-0">
                <Button size="sm" variant="outline">Details</Button>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
