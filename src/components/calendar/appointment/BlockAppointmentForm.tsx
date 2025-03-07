
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';

interface BlockAppointmentFormProps {
  initialDate?: Date;
  initialTime?: string;
}

const BlockAppointmentForm: React.FC<BlockAppointmentFormProps> = ({
  initialDate = new Date(),
  initialTime,
}) => {
  const [blockName, setBlockName] = useState('');
  const [date, setDate] = useState<Date | undefined>(initialDate);
  const [startTime, setStartTime] = useState(initialTime || '09:00');
  const [duration, setDuration] = useState('60');
  const [notes, setNotes] = useState('');

  const durations = [
    { value: '30', label: '30 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
    { value: '180', label: '3 hours' },
    { value: '240', label: '4 hours' },
    { value: '480', label: 'Full day (8 hours)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-6">Create Time Block</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Block out time on your calendar for personal events, meetings, or vacation time.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="block-name">Block Name</Label>
          <Input
            id="block-name"
            value={blockName}
            onChange={(e) => setBlockName(e.target.value)}
            placeholder="e.g., Meeting, Vacation, Personal Time"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="block-date">Date</Label>
          <div className="flex mt-1.5">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="block-date"
                  className={cn(
                    "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                    "focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 justify-start text-left font-normal"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start-time">Start Time</Label>
            <div className="relative mt-1.5">
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="pl-9"
              />
              <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Select 
              value={duration} 
              onValueChange={setDuration}
            >
              <SelectTrigger id="duration" className="mt-1.5">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional details..."
            className="mt-1.5"
          />
        </div>
      </div>
    </div>
  );
};

export default BlockAppointmentForm;
