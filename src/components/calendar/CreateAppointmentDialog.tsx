
import React, { useState } from 'react';
import { format } from 'date-fns';
import { X, Bold, Italic, Underline, Link2, AlignLeft, List, ListOrdered, Search } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface CreateAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  selectedTime?: string;
}

export const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({
  isOpen,
  onClose,
  selectedDate,
  selectedTime
}) => {
  const [appointmentDate, setAppointmentDate] = useState<string>(
    format(selectedDate, "MMM dd, yyyy") + (selectedTime ? ` ${selectedTime}` : " 11:00 AM")
  );

  const handleCreateAppointment = () => {
    // In a real app, this would save the appointment
    console.log("Creating appointment");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        <DialogHeader className="px-6 py-4 flex flex-row justify-between items-center border-b">
          <DialogTitle className="text-xl">Create Appointment</DialogTitle>
          <div className="flex items-center">
            <Button variant="ghost" className="text-primary">Switch to Block</Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="ml-2">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Order Details */}
          <div className="p-6 bg-muted/20">
            <h2 className="text-xl font-semibold mb-6">Create New Order</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-2">Address</p>
                <p className="text-sm text-muted-foreground mb-1">Search Address</p>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search an address..." className="pl-9" />
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Customer</p>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search for a customer..." className="pl-9" />
                </div>
                <Button variant="link" className="p-0 h-auto text-primary mt-1">Create New Customer</Button>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Order Notes (private)</p>
                <div className="border rounded-md mb-2">
                  <div className="flex items-center border-b p-1 gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Link2 className="h-4 w-4" />
                    </Button>
                    <div className="h-6 w-px bg-border mx-1"></div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea className="border-0 focus-visible:ring-0" placeholder="Enter notes here..." />
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Products</p>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search for a product..." className="pl-9" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Custom Items</p>
                  <Button variant="link" className="p-0 h-auto text-primary">Add Custom Item</Button>
                </div>
                <p className="text-sm text-muted-foreground">No custom items added.</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Order Form Custom Fields</p>
                <p className="text-sm text-muted-foreground mb-2">Select the order form to pull the custom fields from.</p>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an order form" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Form</SelectItem>
                    <SelectItem value="commercial">Commercial Form</SelectItem>
                    <SelectItem value="residential">Residential Form</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {/* Right Column - Appointment Details */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Appointment Details</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-2">Appointment Date</p>
                <Input value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Timezone</p>
                  <Select defaultValue="australia-sydney">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="australia-sydney">Australia/Sydney</SelectItem>
                      <SelectItem value="america-newyork">America/New York</SelectItem>
                      <SelectItem value="europe-london">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Hours</p>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">0.5</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="1.5">1.5</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="2.5">2.5</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Minutes</p>
                  <Select defaultValue="0">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="45">45</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Team Members</p>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search for a team member..." className="pl-9" />
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Send notifications</p>
                <div className="flex items-center space-x-2">
                  <Checkbox id="notifications" defaultChecked />
                  <label htmlFor="notifications" className="text-sm font-medium">
                    Send notifications when creating the appointment
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={onClose} className="mr-2">Close</Button>
          <Button onClick={handleCreateAppointment}>Create Appointment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
