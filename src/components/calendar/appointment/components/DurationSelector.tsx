
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';

interface DurationSelectorProps {
  selectedDuration: string;
  onDurationChange: (duration: string) => void;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({
  selectedDuration,
  onDurationChange
}) => {
  const [durationInputOpen, setDurationInputOpen] = useState(false);
  const [durationInputValue, setDurationInputValue] = useState(selectedDuration);

  const durationOptions = [
    "45 minutes",
    "1.5 hours",
    "2.25 hours",
    "3 hours"
  ];

  const handleDurationChange = (duration: string) => {
    onDurationChange(duration);
    setDurationInputValue(duration);
    setDurationInputOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="duration">Duration</Label>
      <div className="relative">
        <Popover open={durationInputOpen} onOpenChange={setDurationInputOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                placeholder="Select duration"
                value={durationInputValue}
                onChange={(e) => setDurationInputValue(e.target.value)}
                onClick={() => setDurationInputOpen(true)}
                className="w-full"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search duration..." />
              <CommandList>
                <CommandEmpty>No duration found.</CommandEmpty>
                <CommandGroup>
                  {durationOptions.map((duration) => (
                    <CommandItem 
                      key={duration} 
                      value={duration}
                      onSelect={() => handleDurationChange(duration)}
                    >
                      {duration}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
