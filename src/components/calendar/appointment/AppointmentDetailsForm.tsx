
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { TimeSelector } from './TimeSelector';
import { TimeSelectorProps } from './TimeSelector';
import { DurationSelector } from './DurationSelector';
import { UseFormReturn } from 'react-hook-form';

interface AppointmentDetailsFormProps {
  form: UseFormReturn<any>;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  onDurationChange: (duration: number) => void;
  timeOptions: TimeSelectorProps['options'];
  selectedDate: Date;
  selectedTime: string;
  selectedDuration: number;
}

const AppointmentDetailsForm: React.FC<AppointmentDetailsFormProps> = ({
  form,
  onDateChange,
  onTimeChange,
  onDurationChange,
  timeOptions,
  selectedDate,
  selectedTime,
  selectedDuration,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="scheduledDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <DatePicker
                date={selectedDate}
                onSelect={(date) => {
                  onDateChange(date);
                  field.onChange(date);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="scheduledTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <TimeSelector
                options={timeOptions}
                value={selectedTime}
                onChange={(time) => {
                  onTimeChange(time);
                  field.onChange(time);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <DurationSelector
                value={selectedDuration}
                onChange={(duration) => {
                  const durationNumber = Number(duration);
                  onDurationChange(durationNumber);
                  field.onChange(durationNumber);
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="package"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Package</SelectItem>
                  <SelectItem value="standard">Standard Package</SelectItem>
                  <SelectItem value="premium">Premium Package</SelectItem>
                  <SelectItem value="custom">Custom Package</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter price"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="property_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Type</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="square_feet"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Square Feet</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Square footage"
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customer_notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer Notes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Additional information from customer..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AppointmentDetailsForm;
