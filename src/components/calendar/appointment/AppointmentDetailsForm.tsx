
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AppointmentDetailsFormProps {
  appointmentDate: string;
  setAppointmentDate: (date: string) => void;
}

export const AppointmentDetailsForm: React.FC<AppointmentDetailsFormProps> = ({
  appointmentDate,
  setAppointmentDate
}) => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Appointment Details</h2>
      
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium mb-2">Appointment Date</p>
          <Input 
            value={appointmentDate} 
            onChange={(e) => setAppointmentDate(e.target.value)} 
          />
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
  );
};
