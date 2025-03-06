
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, X, MapPin, Calendar, Clock, User } from 'lucide-react';
import { Order } from '@/types/orders';
import { CalendarEvent } from '@/types/calendar';

interface CalendarEventPopoverProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  orders: Order[];
}

export const CalendarEventPopover: React.FC<CalendarEventPopoverProps> = ({
  event,
  onClose,
  onEdit,
  onDelete,
  orders,
}) => {
  return (
    <Card className="w-80 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{event.title}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">Order #{event.orderNumber}</div>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        {event.client && (
          <div className="flex items-center text-sm">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{event.client}</span>
          </div>
        )}
        {event.photographer && (
          <div className="flex items-center text-sm">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>Photographer: {event.photographer}</span>
          </div>
        )}
        {event.location && (
          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{event.location}</span>
          </div>
        )}
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{event.start.toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>
            {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
            {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-3.5 w-3.5" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
