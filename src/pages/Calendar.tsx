
import { useState, useEffect, useCallback, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout"; // Changed from import { MainLayout }
import { 
  Plus, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  List,
  Users,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog } from "@/components/ui/dialog";
import { CreateAppointmentDialog } from "@/components/calendar/CreateAppointmentDialog";
import { format, addDays, addWeeks, subDays, subWeeks, addMonths, subMonths } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useHeaderSettings } from "@/hooks/useHeaderSettings";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface Photographer {
  id: string;
  name: string;
  color: string;
  selected: boolean;
}

export function CalendarPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"month" | "week" | "day" | "agenda">("month");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [photographers, setPhotographers] = useState<Photographer[]>([
    { id: "1", name: "David Thompson", color: "#3b82f6", selected: true },
    { id: "2", name: "Emma Richardson", color: "#ef4444", selected: true },
    { id: "3", name: "Michael Clem", color: "#10b981", selected: true },
    { id: "4", name: "Sophia Martinez", color: "#f59e0b", selected: true }
  ]);
  const [timezone, setTimezone] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const calendarRef = useRef<HTMLDivElement>(null);
  const { updateSettings } = useHeaderSettings();
  
  useEffect(() => {
    updateSettings({
      title: "Calendar",
      description: "Manage your shooting schedule and appointments"
    });
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [updateSettings]);

  const handleViewChange = (value: string) => {
    setView(value as "month" | "week" | "day" | "agenda");
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
    } else if (view === "month") {
      setSelectedDate(prev => subMonths(prev, 1));
    }
  };

  const navigateNext = () => {
    if (view === "day") {
      setSelectedDate(prev => addDays(prev, 1));
    } else if (view === "week") {
      setSelectedDate(prev => addWeeks(prev, 1));
    } else if (view === "month") {
      setSelectedDate(prev => addMonths(prev, 1));
    }
  };

  const togglePhotographer = (id: string) => {
    setPhotographers(prev => 
      prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p)
    );
  };

  const handleCalendarClick = useCallback((e: React.MouseEvent) => {
    // Only handle clicks directly on the calendar container
    if (e.target === calendarRef.current || calendarRef.current?.contains(e.target as Node)) {
      if ((e.target as HTMLElement).closest('button')) {
        // Ignore if clicking a button
        return;
      }
      
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const roundedMinutes = Math.floor(minutes / 15) * 15;
      
      const formattedTime = `${hours}:${roundedMinutes === 0 ? '00' : roundedMinutes}`;
      handleOpenDialog(formattedTime);
    }
  }, []);

  const handleRefreshCalendar = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Calendar refreshed");
    }, 800);
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b bg-background">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
              <CalendarIcon className="h-7 w-7 text-primary" />
              Calendar
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your shooting schedule and appointments
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={handleRefreshCalendar}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Button size="sm" onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                New Order
              </Button>
              <CreateAppointmentDialog 
                isOpen={isDialogOpen} 
                onClose={handleCloseDialog} 
                selectedDate={selectedDate}
                initialTime={timeSlot || undefined}
              />
            </Dialog>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="hidden md:flex flex-col w-64 border-r overflow-y-auto p-4 bg-muted/10">
            <div className="mb-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "MMMM yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="mb-6">
              <div className="font-medium mb-2 text-sm">Timezone</div>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="Australia/Sydney">Australian Eastern Time (AET)</SelectItem>
                  <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Central European Time (CET)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">Photographers</h3>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  Team
                </Button>
              </div>
              <div className="space-y-2">
                {photographers.map(photographer => (
                  <div key={photographer.id} className="flex items-center">
                    <Checkbox 
                      id={`photographer-${photographer.id}`} 
                      checked={photographer.selected}
                      onCheckedChange={() => togglePhotographer(photographer.id)}
                      className="mr-2"
                      style={{ 
                        backgroundColor: photographer.selected ? photographer.color : undefined,
                        borderColor: photographer.color 
                      }}
                    />
                    <label htmlFor={`photographer-${photographer.id}`} className="text-sm">
                      {photographer.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <div className="font-medium mb-2 text-sm">Event Types</div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox id="event-photo" defaultChecked className="mr-2" />
                  <label htmlFor="event-photo" className="text-sm">Photo Sessions</label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="event-video" defaultChecked className="mr-2" />
                  <label htmlFor="event-video" className="text-sm">Video Sessions</label>
                </div>
                <div className="flex items-center">
                  <Checkbox id="event-unavailable" defaultChecked className="mr-2" />
                  <label htmlFor="event-unavailable" className="text-sm">Unavailable Times</label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Calendar Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-2 md:p-4 border-b flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={navigatePrevious}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-medium min-w-[140px] text-center">
                  {view === 'month' 
                    ? format(selectedDate, 'MMMM yyyy')
                    : view === 'week'
                      ? `Week of ${format(selectedDate, 'MMM d')}`
                      : format(selectedDate, 'EEEE, MMM d')
                  }
                </h2>
                <Button variant="outline" size="icon" onClick={navigateNext}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <Tabs value={view} onValueChange={handleViewChange}>
                <TabsList>
                  <TabsTrigger value="month">
                    <CalendarIcon className="h-4 w-4 mr-2 hidden sm:inline-block" />
                    Month
                  </TabsTrigger>
                  <TabsTrigger value="week">
                    <LayoutDashboard className="h-4 w-4 mr-2 hidden sm:inline-block" />
                    Week
                  </TabsTrigger>
                  <TabsTrigger value="day">
                    <List className="h-4 w-4 mr-2 hidden sm:inline-block" />
                    Day
                  </TabsTrigger>
                  <TabsTrigger value="agenda">
                    Agenda
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex-1 overflow-auto p-2 md:p-4" ref={calendarRef} onClick={handleCalendarClick}>
              {isLoading ? (
                <div className="grid grid-cols-7 gap-2 h-full animate-pulse">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <div key={i} className="bg-muted rounded-md h-24"></div>
                  ))}
                </div>
              ) : (
                <Card className="bg-card rounded-lg h-full overflow-hidden shadow-sm border">
                  <CardContent className="p-0 h-full">
                    <div className="grid grid-cols-7 border-b">
                      {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                        <div key={day} className="font-medium text-center py-2 text-sm border-r last:border-r-0">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 grid-rows-5 h-[calc(100%-36px)]">
                      {Array.from({ length: 35 }).map((_, i) => (
                        <div key={i} className={`border-r border-b p-1 min-h-[120px] ${i % 7 === 6 ? 'border-r-0' : ''}`}>
                          <div className="text-sm font-medium mb-1">
                            {1 + (i % 31)}
                          </div>
                          {/* Sample appointments that would be replaced with real data */}
                          {i === 4 && (
                            <div className="bg-blue-100 text-blue-800 rounded p-1 text-xs mb-1">
                              09:00 Webster Road
                            </div>
                          )}
                          {i === 5 && (
                            <div className="bg-red-100 text-red-800 rounded p-1 text-xs mb-1">
                              Unavailable
                            </div>
                          )}
                          {i === 15 && (
                            <div className="bg-green-100 text-green-800 rounded p-1 text-xs mb-1">
                              14:45 Queen Street
                            </div>
                          )}
                          {i === 23 && (
                            <div className="bg-amber-100 text-amber-800 rounded p-1 text-xs mb-1">
                              15:00 Rymera Crescent
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Adding default export for lazy loading
export default CalendarPage;
