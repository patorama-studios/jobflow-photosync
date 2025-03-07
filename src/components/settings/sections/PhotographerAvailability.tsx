
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Clock, 
  Save, 
  Calendar as CalendarIcon, 
  HelpCircle,
  Trash2
} from "lucide-react";

// Mock data for available times
const DEFAULT_AVAILABLE_TIMES = [
  { day: "monday", available: true, start: "09:00", end: "17:00" },
  { day: "tuesday", available: true, start: "09:00", end: "17:00" },
  { day: "wednesday", available: true, start: "09:00", end: "17:00" },
  { day: "thursday", available: true, start: "09:00", end: "17:00" },
  { day: "friday", available: true, start: "09:00", end: "17:00" },
  { day: "saturday", available: false, start: "10:00", end: "15:00" },
  { day: "sunday", available: false, start: "10:00", end: "15:00" },
];

// Time slots for select options
const TIME_SLOTS = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", 
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00"
];

// Mock unavailable dates
const INITIAL_UNAVAILABLE_DATES = [
  new Date(2023, 5, 15), // June 15, 2023
  new Date(2023, 5, 16), // June 16, 2023
  new Date(2023, 6, 4),  // July 4, 2023
];

export function PhotographerAvailability() {
  const [availableTimes, setAvailableTimes] = useState(DEFAULT_AVAILABLE_TIMES);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>(INITIAL_UNAVAILABLE_DATES);
  const [activeTab, setActiveTab] = useState("weekly");
  const { toast } = useToast();

  const handleAvailabilityChange = (index: number, field: string, value: any) => {
    const updatedTimes = [...availableTimes];
    updatedTimes[index] = {
      ...updatedTimes[index],
      [field]: value
    };
    setAvailableTimes(updatedTimes);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Check if date is already in unavailable dates
    const exists = unavailableDates.some(d => 
      d.getFullYear() === date.getFullYear() && 
      d.getMonth() === date.getMonth() && 
      d.getDate() === date.getDate()
    );
    
    if (exists) {
      // Remove date if it already exists
      setUnavailableDates(unavailableDates.filter(d => 
        d.getFullYear() !== date.getFullYear() || 
        d.getMonth() !== date.getMonth() || 
        d.getDate() !== date.getDate()
      ));
    } else {
      // Add date if it doesn't exist
      setUnavailableDates([...unavailableDates, date]);
    }
  };

  const saveAvailability = () => {
    // In a real app, this would save to a database
    toast({
      title: "Availability saved",
      description: "Your availability settings have been updated",
    });
  };

  const clearUnavailableDates = () => {
    setUnavailableDates([]);
    toast({
      title: "Dates cleared",
      description: "All unavailable dates have been cleared",
    });
  };

  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Photographer Availability</h2>
        <p className="text-muted-foreground">
          Manage your regular working hours and time off
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="dates">Time Off & Holidays</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="space-y-4 pt-4">
          <Card className="p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableTimes.map((slot, index) => (
                  <TableRow key={slot.day}>
                    <TableCell className="font-medium">{formatDay(slot.day)}</TableCell>
                    <TableCell>
                      <Switch 
                        checked={slot.available}
                        onCheckedChange={(checked) => 
                          handleAvailabilityChange(index, "available", checked)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        disabled={!slot.available}
                        value={slot.start}
                        onValueChange={(value) => 
                          handleAvailabilityChange(index, "start", value)
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Start time" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((time) => (
                            <SelectItem key={`start-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        disabled={!slot.available}
                        value={slot.end}
                        onValueChange={(value) => 
                          handleAvailabilityChange(index, "end", value)
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((time) => (
                            <SelectItem key={`end-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                <span>These hours are used when clients book appointments</span>
              </div>
              <Button onClick={saveAvailability}>
                <Save className="mr-2 h-4 w-4" />
                Save Schedule
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="dates" className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Time Off & Holidays</h3>
                </div>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Click on dates to mark them as unavailable. 
                        These dates will be blocked from booking.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Calendar
                mode="multiple"
                selected={unavailableDates}
                onSelect={(dates) => setUnavailableDates(dates || [])}
                className="border rounded-md p-3"
              />
              
              <div className="mt-4 flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={clearUnavailableDates}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
                <Button onClick={saveAvailability}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Dates
                </Button>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium">Blocked Dates</h3>
                <p className="text-sm text-muted-foreground">
                  These dates are blocked and unavailable for booking
                </p>
              </div>
              
              {unavailableDates.length > 0 ? (
                <div className="space-y-2">
                  {unavailableDates.sort((a, b) => a.getTime() - b.getTime()).map((date, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <span className="font-medium">
                          {date.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setUnavailableDates(unavailableDates.filter((_, i) => i !== index));
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No blocked dates selected</p>
                  <p className="text-sm mt-1">Click on dates in the calendar to block them</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
