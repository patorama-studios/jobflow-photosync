
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { getSmartSchedulingSuggestions } from '@/lib/smart-scheduling';
import { toast } from 'sonner';

interface SchedulingAssistantProps {
  address: string;
  photographer?: string;
  onSelectSlot: (date: Date, time: string) => void;
  onSuggestedTimesUpdate?: (times: string[]) => void;
  lat?: number;
  lng?: number;
}

interface Suggestion {
  date: Date;
  time: string;
  reason: string;
  photographerId?: string;
  photographerName?: string;
}

export const SchedulingAssistant: React.FC<SchedulingAssistantProps> = ({
  address,
  photographer,
  onSelectSlot,
  onSuggestedTimesUpdate,
  lat,
  lng
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const loadSuggestions = async () => {
    if (!address) {
      toast.error("Please enter an address to get smart scheduling suggestions");
      return;
    }

    setIsLoading(true);
    try {
      const suggestedSlots = await getSmartSchedulingSuggestions({
        address,
        preferredPhotographer: photographer,
        coordinates: lat && lng ? { lat, lng } : undefined
      });
      
      setSuggestions(suggestedSlots);
      
      // Update parent component with suggested times
      if (onSuggestedTimesUpdate && suggestedSlots.length > 0) {
        const suggestedTimes = suggestedSlots.map(slot => slot.time);
        onSuggestedTimesUpdate(suggestedTimes.slice(0, 3));
      }
      
      if (suggestedSlots.length === 0) {
        toast.warning("No optimal time slots found. Try different parameters.");
      }
    } catch (error) {
      console.error("Error loading suggestions:", error);
      toast.error("Failed to load scheduling suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load suggestions automatically when component mounts and address is provided
    if (address && lat && lng) {
      loadSuggestions();
    }
  }, [address, photographer, lat, lng]);

  const handleSelectSlot = (suggestion: Suggestion) => {
    onSelectSlot(suggestion.date, suggestion.time);
    setIsOpen(false);
    toast.success(`Scheduled for ${format(suggestion.date, 'MMM dd, yyyy')} at ${suggestion.time}`);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center text-xs"
          disabled={!address}
        >
          <Calendar className="mr-2 h-3 w-3" />
          View all smart scheduling suggestions
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 bg-muted/10">
          <h4 className="font-medium text-sm">Smart Scheduling</h4>
          <p className="text-xs text-muted-foreground mt-1">
            AI-powered suggestions based on location, availability, and efficiency
          </p>
        </div>
        <Separator />
        
        {isLoading ? (
          <div className="p-4 flex flex-col items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground mt-2">
              Finding optimal time slots...
            </p>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="p-2 max-h-80 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                onClick={() => handleSelectSlot(suggestion)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-2 text-primary" />
                    <span className="text-sm font-medium">
                      {format(suggestion.date, 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-2 text-primary" />
                    <span className="text-sm">{suggestion.time}</span>
                  </div>
                </div>
                
                {suggestion.photographerName && (
                  <p className="text-xs ml-5 mt-1 text-muted-foreground">
                    {suggestion.photographerName}
                  </p>
                )}
                
                <p className="text-xs ml-5 mt-1 text-muted-foreground">
                  {suggestion.reason}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              No suggestions available yet. Click below to generate some.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={loadSuggestions}
            >
              Generate Suggestions
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
