
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface BlockAppointmentFormProps {
  defaultDate?: Date;
  initialTime?: string;
  isSubmitting?: boolean;
  onSubmit: (data: any) => void;
}

const BlockAppointmentForm: React.FC<BlockAppointmentFormProps> = ({
  defaultDate = new Date(),
  initialTime = "9:00 AM",
  isSubmitting = false,
  onSubmit
}) => {
  const [blockDate, setBlockDate] = useState<Date>(defaultDate);
  const [blockTime, setBlockTime] = useState<string>(initialTime);
  const [blockDuration, setBlockDuration] = useState<string>("2 hours");
  const [blockReason, setBlockReason] = useState<string>("");
  
  const handleSubmit = () => {
    // Create data object to pass to the parent
    const blockData = {
      date: format(blockDate, 'yyyy-MM-dd'),
      time: blockTime,
      duration: blockDuration,
      reason: blockReason,
      type: 'block'
    };
    
    onSubmit(blockData);
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="blockDate">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !blockDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {blockDate ? format(blockDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={blockDate}
              onSelect={(date) => date && setBlockDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="blockTime">Time</Label>
        <Input 
          id="blockTime"
          value={blockTime}
          onChange={(e) => setBlockTime(e.target.value)}
          placeholder="e.g. 9:00 AM"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="blockDuration">Duration</Label>
        <Input 
          id="blockDuration"
          value={blockDuration}
          onChange={(e) => setBlockDuration(e.target.value)}
          placeholder="e.g. 2 hours"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="blockReason">Reason</Label>
        <Textarea 
          id="blockReason"
          value={blockReason}
          onChange={(e) => setBlockReason(e.target.value)}
          placeholder="Why is this time being blocked?"
          className="h-24"
        />
      </div>
      
      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? 'Blocking...' : 'Block Time'}
      </Button>
    </div>
  );
};

export default BlockAppointmentForm;
