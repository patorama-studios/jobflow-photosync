
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, MapPin, Clock, User, Info, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { AvailabilitySelector } from './AvailabilitySelector';

const formSchema = z.object({
  orderNumber: z.string().optional(),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zip: z.string().min(5, { message: "Valid ZIP code is required" }),
  client: z.string().min(1, { message: "Client name is required" }),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email({ message: "Valid email is required" }),
  propertyType: z.string().min(1, { message: "Property type is required" }),
  squareFeet: z.string().min(1, { message: "Square footage is required" }),
  scheduledDate: z.date({ required_error: "Please select a date" }),
  scheduledTime: z.string().min(1, { message: "Please select a time" }),
  photographer: z.string().optional(),
  photographerPayoutRate: z.number().optional(),
  notes: z.string().optional(),
  package: z.string().min(1, { message: "Please select a package" }),
  customFields: z.record(z.string(), z.any()).optional(),
});

type CreateOrderFormProps = {
  onComplete: () => void;
};

export const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [useAiSuggestions, setUseAiSuggestions] = useState(false);
  const [additionalAppointments, setAdditionalAppointments] = useState<Array<{
    date: Date | undefined;
    time: string;
    description: string;
  }>>([]);
  const [customFields, setCustomFields] = useState<Array<{
    key: string;
    value: string;
  }>>([]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      address: "",
      city: "",
      state: "",
      zip: "",
      client: "",
      clientPhone: "",
      clientEmail: "",
      propertyType: "",
      squareFeet: "",
      notes: "",
      package: "standard",
      photographerPayoutRate: 100,
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Here you would normally send the data to your backend
    const orderData = {
      ...values,
      additionalAppointments: additionalAppointments.map(apt => ({
        date: apt.date?.toISOString() || '',
        time: apt.time,
        description: apt.description
      })),
      customFields: customFields.reduce((acc, field) => {
        acc[field.key] = field.value;
        return acc;
      }, {} as Record<string, string>)
    };
    
    console.log(orderData);
    toast({
      title: "Order created successfully",
      description: "The photography session has been scheduled.",
    });
    onComplete();
  };
  
  const nextStep = () => {
    form.trigger().then((isValid) => {
      if (isValid) setStep(step + 1);
    });
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };

  const addAppointment = () => {
    setAdditionalAppointments([...additionalAppointments, {
      date: undefined,
      time: "",
      description: ""
    }]);
  };

  const removeAppointment = (index: number) => {
    setAdditionalAppointments(
      additionalAppointments.filter((_, i) => i !== index)
    );
  };

  const updateAppointment = (index: number, field: string, value: any) => {
    const updatedAppointments = [...additionalAppointments];
    updatedAppointments[index] = {
      ...updatedAppointments[index],
      [field]: value
    };
    setAdditionalAppointments(updatedAppointments);
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { key: "", value: "" }]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(
      customFields.filter((_, i) => i !== index)
    );
  };

  const updateCustomField = (index: number, field: 'key' | 'value', value: string) => {
    const updatedFields = [...customFields];
    updatedFields[index][field] = value;
    setCustomFields(updatedFields);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {step === 1 && "Location & Client Information"}
                  {step === 2 && "Property Details"}
                  {step === 3 && "Scheduling & Photographer"}
                  {step === 4 && "Additional Details"}
                </h3>
                <div className="text-sm text-muted-foreground">
                  Step {step} of 4
                </div>
              </div>
              <div className="w-full bg-secondary h-2 mt-4 rounded-full overflow-hidden">
                <div 
                  className="bg-primary h-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
              
            {step === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="orderNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Auto-generated order number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 grid-cols-1">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Address</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <div className="relative flex-1">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="Enter the property address" 
                                className="pl-10" 
                                {...field} 
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="ZIP Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Client name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Client phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Client email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="residential">Residential</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="land">Land</SelectItem>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="condo">Condominium</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="squareFeet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Square Footage</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Property size in sq ft" 
                            type="number" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="package"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel>Photography Package</FormLabel>
                      <FormControl>
                        <ToggleGroup 
                          type="single" 
                          className="grid grid-cols-1 md:grid-cols-3 gap-4"
                          value={field.value}
                          onValueChange={(value) => {
                            if (value) field.onChange(value);
                          }}
                        >
                          <ToggleGroupItem 
                            value="basic" 
                            className="flex flex-col items-start h-auto p-4 data-[state=on]:bg-primary/10"
                          >
                            <div className="font-semibold">Basic</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Up to 15 photos
                            </div>
                            <div className="font-medium mt-2">$99</div>
                          </ToggleGroupItem>
                          <ToggleGroupItem 
                            value="standard" 
                            className="flex flex-col items-start h-auto p-4 data-[state=on]:bg-primary/10"
                          >
                            <div className="font-semibold">Standard</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Up to 25 photos + virtual tour
                            </div>
                            <div className="font-medium mt-2">$149</div>
                          </ToggleGroupItem>
                          <ToggleGroupItem 
                            value="premium" 
                            className="flex flex-col items-start h-auto p-4 data-[state=on]:bg-primary/10"
                          >
                            <div className="font-semibold">Premium</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Up to 35 photos + virtual tour + aerial
                            </div>
                            <div className="font-medium mt-2">$249</div>
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special instructions or information about the property" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-6">
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "border-2",
                      !useAiSuggestions ? "border-primary" : "border-muted"
                    )}
                    onClick={() => setUseAiSuggestions(false)}
                  >
                    Manual Selection
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "border-2",
                      useAiSuggestions ? "border-primary" : "border-muted"
                    )}
                    onClick={() => setUseAiSuggestions(true)}
                  >
                    Smart Suggestions
                  </Button>
                </div>
                
                {useAiSuggestions ? (
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-md flex items-start gap-3">
                      <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="text-sm">
                        <p className="text-muted-foreground">
                          Based on your location, photographer availability, and optimal driving routes, 
                          we've identified the following optimal scheduling options.
                        </p>
                      </div>
                    </div>
                    
                    <AvailabilitySelector 
                      onSelectDate={(date) => form.setValue('scheduledDate', date)}
                      onSelectTime={(time) => form.setValue('scheduledTime', time)}
                      onSelectPhotographer={(photographer) => form.setValue('photographer', photographer)}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="scheduledDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
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
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Select a time slot" />
                                  </div>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                                <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                                <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                                <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                                <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                                <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                                <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                                <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="photographer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Photographer</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <div className="flex items-center">
                                  <User className="mr-2 h-4 w-4" />
                                  <SelectValue placeholder="Assign a photographer" />
                                </div>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="auto">Auto-assign best match</SelectItem>
                              <SelectItem value="alex">Alex Johnson</SelectItem>
                              <SelectItem value="maria">Maria Garcia</SelectItem>
                              <SelectItem value="wei">Wei Chen</SelectItem>
                              <SelectItem value="priya">Priya Patel</SelectItem>
                              <SelectItem value="thomas">Thomas Wilson</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="photographerPayoutRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Photographer Payout Rate ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Payout rate for this job"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium">Additional Appointments</h4>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addAppointment}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Appointment
                    </Button>
                  </div>

                  {additionalAppointments.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-md">
                      No additional appointments added
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {additionalAppointments.map((appointment, index) => (
                        <div key={index} className="grid gap-4 grid-cols-1 md:grid-cols-3 p-4 border rounded-md relative">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeAppointment(index)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>

                          <div className="space-y-1">
                            <label className="text-sm font-medium">Date</label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !appointment.date && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {appointment.date ? (
                                    format(appointment.date, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={appointment.date}
                                  onSelect={(date) => updateAppointment(index, 'date', date)}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium">Time</label>
                            <Select 
                              value={appointment.time}
                              onValueChange={(value) => updateAppointment(index, 'time', value)}
                            >
                              <SelectTrigger>
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4" />
                                  <SelectValue placeholder="Select time" />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                                <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                                <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                                <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                                <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                                <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                                <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                                <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                                <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                                <SelectItem value="6:00 PM">6:00 PM (Twilight)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium">Description</label>
                            <Input 
                              placeholder="e.g., Twilight shots, Drone footage"
                              value={appointment.description}
                              onChange={(e) => updateAppointment(index, 'description', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium">Custom Fields</h4>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addCustomField}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Field
                    </Button>
                  </div>

                  {customFields.length === 0 ? (
                    <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-md">
                      No custom fields added
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {customFields.map((field, index) => (
                        <div key={index} className="grid gap-4 grid-cols-1 md:grid-cols-2 p-4 border rounded-md relative">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => removeCustomField(index)}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>

                          <div className="space-y-1">
                            <label className="text-sm font-medium">Field Name</label>
                            <Input 
                              placeholder="e.g., Lockbox Code, Special Instructions"
                              value={field.key}
                              onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium">Field Value</label>
                            <Input 
                              placeholder="Enter value"
                              value={field.value}
                              onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              ) : (
                <div></div>
              )}
              
              {step < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Continue
                </Button>
              ) : (
                <Button type="submit">
                  Create Order
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};
