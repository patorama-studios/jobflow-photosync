
import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";

interface Photographer {
  id: string;
  name: string;
  color: string;
  selected: boolean;
}

interface CalendarSidebarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  timezone: string;
  setTimezone: (timezone: string) => void;
  photographers: Photographer[];
  togglePhotographer: (id: string) => void;
}

export function CalendarSidebar({ 
  selectedDate, 
  setSelectedDate, 
  timezone, 
  setTimezone, 
  photographers, 
  togglePhotographer 
}: CalendarSidebarProps) {
  return (
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
  );
}
