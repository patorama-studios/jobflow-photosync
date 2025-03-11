import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { format, addMinutes, parse } from 'date-fns';
import { TimeSelector } from '../TimeSelector';

export interface SchedulingAssistantProps {
  address: string;
  date: Date;
  photographer: string;
  lat: number;
  lng: number;
  onSuggestedTimeSelect: (selectedTime: string) => void;
}

export const SchedulingAssistant: React.FC<SchedulingAssistantProps> = ({
  address,
  date,
  photographer,
  lat,
  lng,
  onSuggestedTimeSelect
}) => {
  const [suggestedTimes, setSuggestedTimes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Generate suggested times based on the date, location, and photographer availability
  useEffect(() => {
    if (!address || !date) return;

    const generateSuggestedTimes = async () => {
      setIsLoading(true);
      
      try {
        // This would normally be an API call to get suggested times
        // For now, we'll just generate some dummy times
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const times = [];
        const startHour = 9; // 9 AM
        const endHour = 17; // 5 PM
        
        for (let hour = startHour; hour < endHour; hour++) {
          const hourFormatted = hour > 12 ? hour - 12 : hour;
          const amPm = hour >= 12 ? 'PM' : 'AM';
          
          times.push(`${hourFormatted}:00 ${amPm}`);
          times.push(`${hourFormatted}:30 ${amPm}`);
        }
        
        setSuggestedTimes(times);
      } catch (error) {
        console.error('Error generating suggested times:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateSuggestedTimes();
  }, [address, date, photographer]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    onSuggestedTimeSelect(time);
    setShowTimeSelector(false);
  };

  const formatDateForDisplay = (date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Scheduling Assistant</CardTitle>
        <CardDescription>
          Find the best time for this appointment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Location</p>
              <p className="text-sm text-muted-foreground">{address}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">Date</p>
              <p className="text-sm text-muted-foreground">{formatDateForDisplay(date)}</p>
            </div>
          </div>
          
          {photographer && (
            <div className="flex items-start space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Photographer</p>
                <p className="text-sm text-muted-foreground">{photographer}</p>
              </div>
            </div>
          )}
          
          <div className="pt-2">
            <p className="text-sm font-medium mb-2">Suggested Times</p>
            {isLoading ? (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Finding the best times...</p>
              </div>
            ) : (
              <div className="relative">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setShowTimeSelector(!showTimeSelector)}
                >
                  <span>{selectedTime || 'Select a time'}</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                
                {showTimeSelector && (
                  <div className="absolute z-10 w-full mt-1">
                    <TimeSelector
                      value={selectedTime}
                      onChange={handleTimeSelect}
                      suggestedTimes={suggestedTimes}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
