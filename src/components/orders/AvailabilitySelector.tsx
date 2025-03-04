
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Car, 
  User,
  Check
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

type AvailabilityOption = {
  id: number;
  date: Date;
  time: string;
  photographer: string;
  drivingDistance: string;
  drivingTime: string;
  isOptimal: boolean;
};

type AvailabilitySelectorProps = {
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
  onSelectPhotographer: (photographer: string) => void;
};

export const AvailabilitySelector: React.FC<AvailabilitySelectorProps> = ({
  onSelectDate,
  onSelectTime,
  onSelectPhotographer
}) => {
  // Sample data - in a real app, this would come from an API
  const options: AvailabilityOption[] = [
    {
      id: 1,
      date: addDays(new Date(), 1),
      time: "10:00 AM",
      photographer: "Maria Garcia",
      drivingDistance: "5.2 miles",
      drivingTime: "12 min",
      isOptimal: true
    },
    {
      id: 2,
      date: addDays(new Date(), 2),
      time: "2:00 PM",
      photographer: "Alex Johnson",
      drivingDistance: "7.8 miles",
      drivingTime: "18 min",
      isOptimal: false
    },
    {
      id: 3,
      date: addDays(new Date(), 3),
      time: "11:30 AM",
      photographer: "Wei Chen",
      drivingDistance: "3.1 miles",
      drivingTime: "8 min",
      isOptimal: true
    }
  ];

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSelect = (option: AvailabilityOption) => {
    setSelectedOption(option.id);
    onSelectDate(option.date);
    onSelectTime(option.time);
    onSelectPhotographer(option.photographer);
  };

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <Card 
          key={option.id}
          className={cn(
            "border-2 cursor-pointer transition-all hover:shadow",
            selectedOption === option.id 
              ? "border-primary" 
              : option.isOptimal 
              ? "border-amber-200 bg-amber-50 dark:bg-amber-950/10" 
              : "border-border"
          )}
          onClick={() => handleSelect(option)}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{format(option.date, "EEEE, MMMM d")}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{option.time}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{option.photographer}</span>
                </div>
                
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{option.drivingDistance}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{option.drivingTime} drive</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                {option.isOptimal && (
                  <span className="text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-full">
                    Optimal
                  </span>
                )}
                
                {selectedOption === option.id && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
