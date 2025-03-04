
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { addDays, format, parseISO, isToday, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { Car, Calendar as CalendarIcon, Clock, MapPin, MoreVertical, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    longitude: 151.209900,
    assignedTo: "John Smith"
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
    longitude: 151.208710,
    assignedTo: "Emma Wilson"
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
    longitude: 151.215987,
    assignedTo: "Michael Brown"
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
    longitude: 151.225900,
    assignedTo: "John Smith"
  },
  {
    id: 5,
    title: "City View Penthouse",
    client: "Luxury Properties Inc",
    date: addDays(new Date(), 3),
    startTime: "14:00",
    endTime: "16:00",
    address: "100 Skyline Drive, Uptown",
    status: "confirmed",
    driveTimeMinutes: 25,
    latitude: -33.885143,
    longitude: 151.219900,
    assignedTo: "John Smith"
  }
];

// Calculate drive time between two locations (using sample data for now)
const calculateDriveTimeBetween = (job1, job2) => {
  // This would be replaced with actual calculation based on distance and traffic
  // For now, using a simplified model based on coordinates
  if (!job1 || !job2) return 0;
  
  const lat1 = job1.latitude;
  const lon1 = job1.longitude;
  const lat2 = job2.latitude;
  const lon2 = job2.longitude;
  
  // Simple distance calculation
  const distance = Math.sqrt(
    Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)
  ) * 1000; // Scale factor for demo

  // Convert to minutes (approximately)
  return Math.round(distance * 5);
};

export function JobCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [calendarView, setCalendarView] = useState("day");
  
  // User's starting location (this would come from user settings)
  const userStartLocation = {
    latitude: -33.860143,
    longitude: 151.205900,
    address: "Home Office"
  };

  // Format time to display hours and minutes
  const formatDriveTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 
      ? `${hours}h ${mins > 0 ? `${mins}m` : ''}`
      : `${mins}m`;
  };

  // Get all jobs for a specific day
  const getJobsForDay = (date) => {
    if (!date) return [];
    return jobs.filter(job => isSameDay(job.date, date))
      .sort((a, b) => {
        // Sort by start time
        const timeA = a.startTime.split(':').map(Number);
        const timeB = b.startTime.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });
  };

  // Get all jobs for a week
  const getJobsForWeek = (date) => {
    if (!date) return [];
    const start = startOfWeek(date);
    const end = endOfWeek(date);
    
    return jobs.filter(job => 
      isWithinInterval(job.date, { start, end })
    );
  };

  // Filter jobs based on the selected view
  const getFilteredJobs = () => {
    if (!selectedDate) return [];
    
    switch(calendarView) {
      case "day":
        return getJobsForDay(selectedDate);
      case "week":
        return getJobsForWeek(selectedDate);
      case "month":
        return jobs; // For month view, show all jobs
      default:
        return getJobsForDay(selectedDate);
    }
  };

  const jobsForView = getFilteredJobs();

  // Calculate total drive time for the day and between jobs
  const calculateDayDriveTimes = (jobsForDay) => {
    if (!jobsForDay.length) return { total: 0, between: [] };
    
    let total = 0;
    const between = [];
    let previousJob = null;
    
    // First job drive time is from home/office
    if (jobsForDay.length > 0) {
      const firstJob = jobsForDay[0];
      // Calculate drive time from starting location to first job
      const firstJobDriveTime = firstJob.driveTimeMinutes;
      total += firstJobDriveTime;
      
      // For each subsequent job, calculate drive time from previous job
      for (let i = 1; i < jobsForDay.length; i++) {
        const currentJob = jobsForDay[i];
        const previousJob = jobsForDay[i - 1];
        const driveTimeBetween = calculateDriveTimeBetween(previousJob, currentJob);
        
        between.push({
          fromJob: previousJob.id,
          toJob: currentJob.id,
          driveTimeMinutes: driveTimeBetween
        });
        
        total += driveTimeBetween;
      }
    }
    
    return { total, between };
  };

  // Calculate drive times for the current view
  const driveTimes = calculateDayDriveTimes(jobsForView);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setShowCalendarPicker(false);
  };
  
  const handlePrevDay = () => {
    if (selectedDate) {
      setSelectedDate(addDays(selectedDate, -1));
    }
  };
  
  const handleNextDay = () => {
    if (selectedDate) {
      setSelectedDate(addDays(selectedDate, 1));
    }
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

  // Render week view calendar
  const renderWeekView = () => {
    if (!selectedDate) return null;
    
    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return (
      <div className="grid grid-cols-7 gap-4 mt-4">
        {daysInWeek.map((day, index) => {
          const dayJobs = getJobsForDay(day);
          const dayDriveTimes = calculateDayDriveTimes(dayJobs);
          
          return (
            <div key={index} className="flex flex-col">
              <div className={`text-center p-2 rounded-t-md ${isSameDay(day, new Date()) ? 'bg-primary text-white' : 'bg-muted'}`}>
                <div className="font-medium">{format(day, 'EEE')}</div>
                <div className="text-sm">{format(day, 'd')}</div>
              </div>
              <div className="border border-t-0 border-border rounded-b-md p-2 min-h-[150px] flex-1">
                {dayJobs.length > 0 ? (
                  <div className="space-y-2">
                    {dayDriveTimes.total > 0 && (
                      <div className="text-xs flex items-center">
                        <Car className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>{formatDriveTime(dayDriveTimes.total)}</span>
                      </div>
                    )}
                    {dayJobs.map((job, jobIndex) => (
                      <div key={jobIndex} className="text-xs p-1 bg-accent rounded">
                        <div className="font-medium truncate">{job.title}</div>
                        <div className="flex justify-between">
                          <span>{job.startTime}</span>
                          <span className="text-muted-foreground">{job.assignedTo}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-center text-muted-foreground pt-4">No jobs</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render month view calendar
  const renderMonthView = () => {
    return (
      <div className="mt-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          modifiers={{
            booked: (date) => jobs.some(job => isSameDay(job.date, date))
          }}
          modifiersClassNames={{
            booked: "!font-bold border border-primary"
          }}
          className="rounded-md w-full"
          classNames={{
            day_selected: getDayClass(selectedDate || new Date())
          }}
        />
      </div>
    );
  };
  
  // Render day view
  const renderDayView = () => {
    const jobsForSelectedDate = selectedDate ? getJobsForDay(selectedDate) : [];
    
    return (
      <div className="mt-4">
        {driveTimes.total > 0 && (
          <div className="mb-4 p-3 bg-muted rounded-lg flex items-center">
            <Car className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <h3 className="text-sm font-medium">Estimated total drive time:</h3>
              <p className="text-lg font-bold">{formatDriveTime(driveTimes.total)}</p>
              <p className="text-xs text-muted-foreground">Starting from: {userStartLocation.address}</p>
            </div>
          </div>
        )}
        
        {jobsForSelectedDate.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No jobs scheduled for this date.
          </div>
        ) : (
          <div className="space-y-4">
            {jobsForSelectedDate.map((job, index) => {
              const prevJob = index > 0 ? jobsForSelectedDate[index - 1] : null;
              const driveTimeBetween = index > 0 
                ? calculateDriveTimeBetween(prevJob, job)
                : job.driveTimeMinutes;
              
              return (
                <div key={job.id}>
                  {index > 0 && driveTimeBetween > 0 && (
                    <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
                      <div className="flex items-center bg-muted px-3 py-1 rounded-full">
                        <Car className="h-3 w-3 mr-1" />
                        <span>{formatDriveTime(driveTimeBetween)} drive</span>
                      </div>
                    </div>
                  )}
                  
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
                          <span className="hidden md:inline">•</span>
                          <span>{job.assignedTo}</span>
                        </div>
                        <div className="mt-1 flex items-center">
                          <MapPin className="h-3 w-3 mr-1 inline" />
                          {job.address}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 mt-4 md:mt-0">
                      {index === 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center text-sm bg-muted px-2 py-1 rounded">
                                <Car className="h-3 w-3 mr-1" />
                                <span>{formatDriveTime(job.driveTimeMinutes)}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Estimated drive time from {userStartLocation.address}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      <Button size="sm" variant="outline">Details</Button>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle>
                {selectedDate && format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
              <div className="flex space-x-1">
                <Button variant="outline" size="icon" onClick={handlePrevDay}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleNextDay}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
          
          <Tabs value={calendarView} onValueChange={setCalendarView} className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="day" className="mt-0">
          {renderDayView()}
        </TabsContent>
        
        <TabsContent value="week" className="mt-0">
          {renderWeekView()}
        </TabsContent>
        
        <TabsContent value="month" className="mt-0">
          {renderMonthView()}
        </TabsContent>
      </CardContent>
    </Card>
  );
}
