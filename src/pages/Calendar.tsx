
import React, { useState } from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { 
  Calendar as CalendarComponent, 
  CalendarProps 
} from '@/components/ui/calendar';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  CalendarDays, 
  Calendar as CalendarIcon, 
  ClockIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

// Sample data for photographers and jobs
const PHOTOGRAPHERS = [
  { id: 1, name: "Alex Johnson", color: "#4f46e5" },
  { id: 2, name: "Maria Garcia", color: "#0ea5e9" },
  { id: 3, name: "Wei Chen", color: "#10b981" },
  { id: 4, name: "Priya Patel", color: "#f59e0b" },
  { id: 5, name: "Thomas Wilson", color: "#ec4899" },
];

const JOBS = [
  { id: 1, title: "Wedding Shoot", photographer: 1, date: new Date(2023, 6, 12), client: "Smith Family" },
  { id: 2, title: "Corporate Headshots", photographer: 2, date: new Date(2023, 6, 15), client: "Acme Inc." },
  { id: 3, title: "Product Photography", photographer: 3, date: new Date(2023, 6, 18), client: "TechGadgets" },
  { id: 4, title: "Family Portraits", photographer: 4, date: new Date(2023, 6, 20), client: "Johnson Family" },
  { id: 5, title: "Fashion Catalog", photographer: 5, date: new Date(2023, 6, 25), client: "StyleBoutique" },
  { id: 6, title: "Real Estate Photos", photographer: 1, date: new Date(2023, 6, 28), client: "Dream Homes" },
];

type ViewMode = 'month' | 'week' | 'day';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedPhotographers, setSelectedPhotographers] = useState<number[]>(
    PHOTOGRAPHERS.map(p => p.id)
  );

  const togglePhotographer = (id: number) => {
    setSelectedPhotographers(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id]
    );
  };

  const filteredJobs = JOBS.filter(job => 
    selectedPhotographers.includes(job.photographer)
  );

  const handlePrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getDateTitle = () => {
    if (viewMode === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (viewMode === 'week') {
      return `Week of ${format(currentDate, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };

  // We'll use this to highlight dates with jobs
  const datesWithJobs = filteredJobs.map(job => job.date);

  const renderMonthView = () => (
    <div className="bg-white rounded-md shadow">
      <CalendarComponent
        mode="single"
        selected={currentDate}
        onSelect={(date) => date && setCurrentDate(date)}
        className="rounded-md border"
        modifiers={{
          hasJob: datesWithJobs,
        }}
        modifiersClassNames={{
          hasJob: "bg-primary/20 font-medium text-primary",
        }}
      />
    </div>
  );

  const renderWeekView = () => (
    <div className="bg-white rounded-md shadow p-4">
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, index) => {
          const day = addDays(
            new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()),
            index
          );
          const dayJobs = filteredJobs.filter(job => 
            job.date.getDate() === day.getDate() && 
            job.date.getMonth() === day.getMonth() && 
            job.date.getFullYear() === day.getFullYear()
          );
          
          return (
            <div 
              key={index} 
              className={`min-h-[150px] border rounded-md p-2 ${
                day.getDate() === new Date().getDate() && 
                day.getMonth() === new Date().getMonth() && 
                day.getFullYear() === new Date().getFullYear() 
                  ? 'bg-primary/10 border-primary' 
                  : ''
              }`}
            >
              <div className="text-center mb-2 font-medium">
                <div className="text-sm text-muted-foreground">{format(day, 'EEE')}</div>
                <div className="text-lg">{format(day, 'd')}</div>
              </div>
              <div className="space-y-1">
                {dayJobs.map(job => (
                  <div 
                    key={job.id} 
                    className="text-xs p-1 rounded truncate" 
                    style={{ backgroundColor: PHOTOGRAPHERS.find(p => p.id === job.photographer)?.color + '20' }}
                  >
                    {job.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDayView = () => (
    <div className="bg-white rounded-md shadow p-4">
      <div className="space-y-2">
        <div className="text-center font-medium text-lg mb-4">
          {format(currentDate, 'EEEE, MMMM d')}
        </div>
        
        {Array.from({ length: 12 }).map((_, index) => {
          const hour = index + 8; // Start from 8 AM
          const hourJobs = filteredJobs.filter(job => 
            job.date.getDate() === currentDate.getDate() && 
            job.date.getMonth() === currentDate.getMonth() && 
            job.date.getFullYear() === currentDate.getFullYear()
          );
          
          return (
            <div key={index} className="grid grid-cols-12 border-b py-2">
              <div className="col-span-1 text-right pr-4 text-muted-foreground">
                {hour % 12 === 0 ? 12 : hour % 12}{hour < 12 ? 'am' : 'pm'}
              </div>
              <div className="col-span-11 border-l pl-4 min-h-[40px]">
                {hourJobs.map(job => (
                  <div 
                    key={job.id} 
                    className="text-sm p-2 rounded mb-1" 
                    style={{ backgroundColor: PHOTOGRAPHERS.find(p => p.id === job.photographer)?.color + '20' }}
                  >
                    <div className="font-medium">{job.title}</div>
                    <div className="text-xs text-muted-foreground">{job.client}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <SidebarLayout>
      <PageTransition>
        <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-semibold">Photography Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Manage your shooting schedule and assignments
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium w-40 text-center">
              {getDateTitle()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main content - calendar views */}
          <div className="col-span-12 md:col-span-9">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Schedule</CardTitle>
                  <Tabs 
                    value={viewMode} 
                    onValueChange={(v) => setViewMode(v as ViewMode)}
                    className="w-fit"
                  >
                    <TabsList>
                      <TabsTrigger value="month" className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Month
                      </TabsTrigger>
                      <TabsTrigger value="week" className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Week
                      </TabsTrigger>
                      <TabsTrigger value="day" className="flex items-center">
                        <ClockIcon className="mr-2 h-4 w-4" />
                        Day
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === 'month' && renderMonthView()}
                {viewMode === 'week' && renderWeekView()}
                {viewMode === 'day' && renderDayView()}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - photographer filters */}
          <div className="col-span-12 md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Photographers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PHOTOGRAPHERS.map((photographer) => (
                    <div key={photographer.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`photographer-${photographer.id}`}
                        checked={selectedPhotographers.includes(photographer.id)}
                        onCheckedChange={() => togglePhotographer(photographer.id)}
                      />
                      <label 
                        htmlFor={`photographer-${photographer.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                      >
                        <span 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: photographer.color }}
                        ></span>
                        {photographer.name}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    </SidebarLayout>
  );
};

export default Calendar;
