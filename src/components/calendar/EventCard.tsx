
import React from 'react';
import { format, isPast } from 'date-fns';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface EventCardProps {
  event: any;
  showDate?: boolean;
  isPast?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  showDate = true, 
  isPast = false 
}) => {
  return (
    <Card className={`${isPast ? 'opacity-60' : ''}`}>
      <CardContent className="p-3">
        <div className="flex items-start space-x-3">
          <div 
            className="w-2 self-stretch rounded-full" 
            style={{ backgroundColor: event.color }}
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-sm">{event.title}</h4>
              {isPast && (
                <span className="text-xs bg-gray-200 rounded-full px-2 py-0.5">Completed</span>
              )}
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Clock className="h-3 w-3 mr-1" />
              <span>
                {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
              </span>
            </div>
            
            {showDate && (
              <div className="text-xs text-muted-foreground mt-1">
                {format(event.start, 'EEEE, MMMM d')}
              </div>
            )}
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs bg-accent px-2 py-0.5 rounded-full">
                {event.photographer}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
