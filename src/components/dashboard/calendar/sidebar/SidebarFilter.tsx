
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format, addDays, subDays, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { PhotographerFilter } from '@/components/layout/sidebar/PhotographerFilter';

type Photographer = {
  id: number;
  name: string;
  color: string;
};

const samplePhotographers: Photographer[] = [
  { id: 1, name: 'David Thompson', color: '#4299E1' },  // Blue
  { id: 2, name: 'Emma Richardson', color: '#F6E05E' }, // Yellow
  { id: 3, name: 'Michael Clem', color: '#F6AD55' },    // Orange
  { id: 4, name: 'Sophia Martinez', color: '#F687B3' }, // Pink
];

interface SidebarFilterProps {
  selectedDate: Date;
  onDateSelect: (date: Date | undefined) => void;
}

export const SidebarFilter: React.FC<SidebarFilterProps> = ({ 
  selectedDate,
  onDateSelect
}) => {
  const [selectedPhotographers, setSelectedPhotographers] = React.useState<number[]>([1, 2, 3, 4]);
  
  const togglePhotographer = (id: number) => {
    setSelectedPhotographers(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const showMonthCalendar = (month: Date) => {
    // In real implementation, this would filter calendar events by month
    console.log("Show calendar for month:", format(month, 'MMMM yyyy'));
  };

  const dayClassName = (date: Date) => {
    const isSelected = date.getDate() === selectedDate.getDate() && 
                      date.getMonth() === selectedDate.getMonth() && 
                      date.getFullYear() === selectedDate.getFullYear();
                      
    if (isSelected) {
      return "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground";
    }
    return "";
  };

  return (
    <div className="w-full max-w-[250px] border-r p-4 space-y-6 h-full overflow-y-auto">
      <div className="text-center mb-2">
        <h3 className="font-medium mb-2">{format(selectedDate, 'MMMM yyyy')}</h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          showOutsideDays
          className="rounded-md border"
          classNames={{
            day_selected: dayClassName(selectedDate),
          }}
        />
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Time Filter</h3>
          <div className="flex items-center space-x-2">
            <Checkbox id="operating-hours" />
            <label htmlFor="operating-hours" className="text-sm">Operating hours only</label>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Timezone</h3>
          <div className="relative">
            <select className="w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background">
              <option value="utc+10">(UTC+10:00) Brisbane</option>
              <option value="utc+11">(UTC+11:00) Sydney, Melbourne</option>
              <option value="utc+8">(UTC+8:00) Perth</option>
            </select>
          </div>
        </div>
        
        <PhotographerFilter
          photographers={samplePhotographers}
          selectedPhotographers={selectedPhotographers}
          onToggle={togglePhotographer}
          isMobile={false}
        />
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Event Type</h3>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Clear</Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="job-type" defaultChecked />
              <label htmlFor="job-type" className="text-sm flex items-center">
                <span className="inline-block w-4 h-4 bg-blue-100 border border-blue-500 mr-1"></span>
                Job
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="unavailable-type" defaultChecked />
              <label htmlFor="unavailable-type" className="text-sm flex items-center">
                <span className="inline-block w-4 h-4 bg-red-100 border border-red-500 mr-1"></span>
                Unavailable
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="lunch-type" defaultChecked />
              <label htmlFor="lunch-type" className="text-sm flex items-center">
                <span className="inline-block w-4 h-4 bg-green-100 border border-green-500 mr-1"></span>
                Lunch
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
