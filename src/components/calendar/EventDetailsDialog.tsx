
import React from 'react';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon,
  Users,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  Edit,
  X,
  CalendarDays,
  ExternalLink
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EventDetailsDialogProps {
  selectedEvent: any | null;
  showEventDetails: boolean;
  setShowEventDetails: (show: boolean) => void;
}

export const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({
  selectedEvent,
  showEventDetails,
  setShowEventDetails
}) => {
  if (!selectedEvent) return null;
  
  return (
    <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Order #{selectedEvent.orderNumber} - {selectedEvent.client}
          </DialogTitle>
          <DialogDescription>
            {selectedEvent.address}
          </DialogDescription>
        </DialogHeader>
        
        {/* Map Hero Section */}
        <div className="w-full h-48 bg-muted rounded-lg mb-4 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
          <MapPin className="h-12 w-12 text-primary opacity-50" />
          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
            {selectedEvent.address}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Details */}
          <div>
            <h3 className="font-semibold mb-3">Customer Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{selectedEvent.client}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{selectedEvent.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{selectedEvent.email}</span>
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">Notes:</span>
                </div>
                <p className="text-muted-foreground pl-6">{selectedEvent.notes}</p>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-medium mb-1">Items Ordered:</div>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {selectedEvent.items.map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-medium mb-1">Appointment:</div>
                <div className="text-muted-foreground pl-3 space-y-1">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <span>{format(selectedEvent.start, 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{format(selectedEvent.start, 'h:mm a')} - {format(selectedEvent.end, 'h:mm a')}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="font-medium mb-1">Photographer:</div>
                <div className="flex items-center text-muted-foreground pl-3">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{selectedEvent.photographer}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-wrap gap-2 mt-4">
          <Button variant="outline" className="flex items-center">
            <X className="h-4 w-4 mr-1" />
            Cancel Order
          </Button>
          <Button variant="outline" className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1" />
            Postpone
          </Button>
          <Button variant="outline" className="flex items-center">
            <Edit className="h-4 w-4 mr-1" />
            Edit Appointment
          </Button>
          <Button className="flex items-center">
            <ExternalLink className="h-4 w-4 mr-1" />
            View Full Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
