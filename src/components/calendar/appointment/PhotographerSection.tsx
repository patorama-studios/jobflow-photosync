
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { usePhotographers } from '@/hooks/use-photographers';
import { Loader2 } from 'lucide-react';

interface PhotographerSectionProps {
  selectedPhotographer?: string;
  onSelectPhotographer?: (photographerId: string) => void;
  onDateTimeSelect?: (date: Date, time: string) => void;
  scheduledDate?: Date;
  scheduledTime?: string;
}

export const PhotographerSection: React.FC<PhotographerSectionProps> = ({ 
  selectedPhotographer,
  onSelectPhotographer,
  onDateTimeSelect,
  scheduledDate,
  scheduledTime
}) => {
  const { photographers, isLoading } = usePhotographers();
  const [searchQuery, setSearchQuery] = useState('');
  const [date, setDate] = useState<Date | undefined>(scheduledDate);
  const [time, setTime] = useState<string | undefined>(scheduledTime);
  
  // Update local state when props change
  useEffect(() => {
    if (scheduledDate) setDate(scheduledDate);
    if (scheduledTime) setTime(scheduledTime);
  }, [scheduledDate, scheduledTime]);
  
  // Filter photographers based on search query
  const filteredPhotographers = photographers.filter(photographer => 
    searchQuery === '' || 
    photographer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePhotographerSelect = (photographer: any) => {
    if (onSelectPhotographer) {
      onSelectPhotographer(photographer.id.toString());
    }
    setSearchQuery('');
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value ? new Date(e.target.value) : undefined;
    setDate(newDate);
    if (newDate && time && onDateTimeSelect) {
      onDateTimeSelect(newDate, time);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (date && newTime && onDateTimeSelect) {
      onDateTimeSelect(date, newTime);
    }
  };

  const selectedPhotographerData = photographers.find(
    photographer => photographer.id.toString() === selectedPhotographer
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium mb-2">Photographer</p>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search for a photographer..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {isLoading ? (
          <div className="flex items-center space-x-2 mt-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading photographers...</span>
          </div>
        ) : searchQuery && filteredPhotographers.length > 0 ? (
          <div className="mt-1 border rounded-md shadow-sm bg-background max-h-40 overflow-y-auto z-50 absolute">
            {filteredPhotographers.map((photographer) => (
              <div 
                key={photographer.id}
                className="p-2 hover:bg-muted/50 cursor-pointer"
                onClick={() => handlePhotographerSelect(photographer)}
              >
                <p className="font-medium">{photographer.name}</p>
                {photographer.email && (
                  <p className="text-sm text-muted-foreground">{photographer.email}</p>
                )}
              </div>
            ))}
          </div>
        ) : null}
        
        {selectedPhotographerData && (
          <div className="mt-2 p-2 bg-primary/5 rounded text-sm">
            <p className="font-medium">{selectedPhotographerData.name}</p>
            {selectedPhotographerData.email && (
              <p className="text-muted-foreground">{selectedPhotographerData.email}</p>
            )}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium mb-2">Date & Time</p>
        <div className="grid grid-cols-2 gap-2">
          <Input 
            type="date" 
            placeholder="Select date" 
            value={date ? date.toISOString().split('T')[0] : ''}
            onChange={handleDateChange}
          />
          <Input 
            type="time" 
            placeholder="Select time" 
            value={time || ''}
            onChange={handleTimeChange}
          />
        </div>
      </div>
    </div>
  );
};
