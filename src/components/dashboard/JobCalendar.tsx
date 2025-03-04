
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format, parseISO, isToday, isSameDay } from "date-fns";
import { Car, Calendar as CalendarIcon, Clock, MapPin, MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Sample job data with more realistic dates and drive times
const jobs = [
  {
    id: 1,
    title: "Luxury Beachfront Property",
    client: "Ocean View Realty",
    date: new Date(),
    startTime: "09:00",
    endTime: "11:00",
    address: "123 Coastal Way, Beachside",
    status: "confirmed",
    driveTimeMinutes: 35,
    latitude: -33.865143,
    longitude: 151.209900
  },
  {
    id: 2,
    title: "Modern Downtown Apartment",
    client: "Urban Living Properties",
    date: addDays(new Date(), 1),
    startTime: "13:00",
    endTime: "14:30",
    address: "456 City Center Blvd, Downtown",
    status: "pending",
    driveTimeMinutes: 20,
    latitude: -33.870243,
    longitude: 151.208710
  },
  {
    id: 3,
    title: "Suburban Family Home",
    client: "Hometown Realty",
    date: addDays(new Date(), 2),
    startTime: "15:30",
    endTime: "17:00",
    address: "789 Maple Street, Suburbia",
    status: "confirmed",
    driveTimeMinutes: 45,
    latitude: -33.880211,
    longitude: 151.215987
  },
  {
    id: 4,
    title: "Heritage Cottage Renovation",
    client: "Classic Homes Realty",
    date: addDays(new Date(), 3),
    startTime: "10:00",
    endTime: "12:00",
    address: "42 Historic Lane, Heritage District",
    status: "confirmed",
    driveTimeMinutes: 30,
    latitude: -33.890143,
    longitude: 151.225900
  }
];

export function JobCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);

  // Filter jobs for the selected date
  const jobsForSelectedDate = selectedDate 
    ? jobs.filter(job => isSameDay(job.date, selectedDate))
    : [];

  // Calculate total drive time for the day
  const totalDriveTimeMinutes = jobsForSelectedDate.reduce(
    (total, job) => total + job.driveTimeMinutes, 
    0
  );

  // Format time to display hours and minutes
  const formatDriveTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 
      ? `${hours}h ${mins > 0 ? `${mins}m` : ''}`
      : `${mins}m`;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setShowCalendarPicker(false);
  };

  // Function to get custom day class based on job status
  const getDayClass = (date: Date) => {
    const jobsOnDate = jobs.filter(job => isSameDay(job.date, date));
    
    if (jobsOnDate.length === 0) return "";
    
    const hasConfirmed = jobsOnDate.some(job => job.status === "confirmed");
    const hasPending = jobsOnDate.some(job => job.status === "pending");
    
    if (hasConfirmed && hasPending) return "bg-gradient-to-br from-green-500 to-amber-500 text-white";
    if (hasConfirmed) return "bg-green-500 text-white";
    if (hasPending) return "bg-amber-500 text-white";
    
    return "";
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>
            {selectedDate && format(selectedDate, "MMMM d, yyyy")}
          </CardTitle>
          <div className="flex space-x-2">
            <div className="relative">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowCalendarPicker(!showCalendarPicker)}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                {isToday(selectedDate || new Date()) 
                  ? "Today" 
                  : "Pick Date"
                }
              </Button>
              
              {showCalendarPicker && (
                <div className="absolute right-0 z-10 mt-2 bg-white shadow-lg rounded-md border border-border p-2">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    modifiers={{
                      booked: (date) => 
                        jobs.some(job => isSameDay(job.date, date))
                    }}
                    modifiersClassNames={{
                      booked: "!font-bold border border-primary"
                    }}
                    className="rounded-md"
                    classNames={{
                      day_selected: getDayClass(new Date())
                    }}
                  />
                </div>
              )}
            </div>
            <Button size="sm" variant="default">
              <Plus className="h-4 w-4 mr-2" />
              New Job
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {totalDriveTimeMinutes > 0 && (
          <div className="mb-4 p-3 bg-muted rounded-lg flex items-center">
            <Car className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <h3 className="text-sm font-medium">Estimated total drive time:</h3>
              <p className="text-lg font-bold">{formatDriveTime(totalDriveTimeMinutes)}</p>
            </div>
          </div>
        )}
        
        {jobsForSelectedDate.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No jobs scheduled for this date.
          </div>
        ) : (
          <div className="grid gap-4">
            {jobsForSelectedDate.map((job) => (
              <GlassCard 
                key={job.id} 
                className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border/60"
                hoverEffect
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
                      <span>{job.startTime} - {job.endTime}</span>
                    </div>
                    <div className="mt-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1 inline" />
                      {job.address}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center text-sm bg-muted px-2 py-1 rounded">
                          <Car className="h-3 w-3 mr-1" />
                          <span>{formatDriveTime(job.driveTimeMinutes)}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Estimated drive time to location</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button size="sm" variant="outline">Details</Button>
                  <Button size="icon" variant="ghost">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
