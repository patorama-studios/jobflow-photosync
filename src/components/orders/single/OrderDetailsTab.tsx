
import React, { useState } from 'react';
import { Order } from '@/types/order-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin, User, PhoneCall, Mail, FileText, Plus, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreateAppointmentDialog } from '@/components/calendar/CreateAppointmentDialog';
import { toast } from 'sonner';

interface OrderDetailsTabProps {
  order: Order;
}

export const OrderDetailsTab: React.FC<OrderDetailsTabProps> = ({ order }) => {
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  
  // Fix: Convert order.id to string if it's a number
  const orderId = typeof order.id === 'number' ? order.id.toString() : order.id;
  
  // Fetch additional appointments
  const { data: additionalAppointments, isLoading, refetch } = useQuery({
    queryKey: ['additionalAppointments', orderId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('additional_appointments')
          .select('*')
          .eq('order_id', orderId)
          .order('date', { ascending: true });
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching additional appointments:', error);
        return [];
      }
    },
    enabled: !!orderId
  });
  
  // Handle creating a new appointment
  const handleAddAppointment = async (appointmentData) => {
    try {
      // Create appointment in Calendar system
      // In a real implementation, this would integrate with the calendar system
      
      // Add to additional_appointments table
      const { error } = await supabase
        .from('additional_appointments')
        .insert({
          order_id: orderId,
          date: appointmentData.date,
          time: appointmentData.time,
          description: appointmentData.notes || 'Follow-up appointment'
        });
        
      if (error) throw error;
      
      // Refetch appointments
      refetch();
      
      toast.success("Appointment added successfully");
      return true;
    } catch (error) {
      console.error('Error adding appointment:', error);
      toast.error("Failed to add appointment");
      return false;
    }
  };
  
  // Format date for display
  const formatAppointmentDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Appointments section */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2" />
                Appointments
              </CardTitle>
              <CardDescription>
                Manage and schedule appointments for this order
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsAppointmentDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Appointment
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 border rounded-md bg-muted/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Primary Appointment</p>
                  <p className="text-muted-foreground">
                    {order.scheduledDate || order.scheduled_date} at {order.scheduledTime || order.scheduled_time}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Photographer: {order.photographer}</p>
                </div>
              </div>
            </div>
            
            {/* Additional Appointments */}
            {isLoading ? (
              <div className="py-4 text-center text-muted-foreground">
                Loading appointments...
              </div>
            ) : additionalAppointments && additionalAppointments.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-sm font-medium mb-2">Additional Appointments</h3>
                {additionalAppointments.map((apt, index) => (
                  <div key={apt.id || index} className="p-3 border rounded-md bg-muted/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{formatAppointmentDate(apt.date)}</p>
                        <p className="text-sm text-muted-foreground">{apt.time}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>{apt.description || "Follow-up appointment"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                No additional appointments scheduled
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <a href="/calendar" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                View in Calendar
              </a>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Order notes section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Order Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium mb-2">Customer Notes</h3>
            <p className="text-muted-foreground mb-4">{order.customerNotes || order.customer_notes || 'No customer notes'}</p>
            
            <Separator className="my-4" />
            
            <h3 className="font-medium mb-2">Internal Notes</h3>
            <p className="text-muted-foreground">{order.internalNotes || order.internal_notes || 'No internal notes'}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Customer details and activity feed */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{order.client}</h3>
              </div>
              
              <div className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-muted-foreground" />
                <span>{order.clientPhone || order.client_phone || 'No phone number'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{order.clientEmail || order.client_email || 'No email'}</span>
              </div>
              
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p>{order.address}</p>
                  <p>{order.city}, {order.state} {order.zip}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Order Activity Feed */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
            <CardDescription>Recent actions and updates on this order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Fetch and display actual activity feed from order_activities table */}
              <ActivityFeed orderId={orderId} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Appointment Dialog */}
      <CreateAppointmentDialog
        isOpen={isAppointmentDialogOpen} 
        onClose={() => setIsAppointmentDialogOpen(false)}
        selectedDate={new Date()}
        onAppointmentAdded={handleAddAppointment}
        existingOrderData={order}
      />
    </div>
  );
};

// Activity Feed Component
const ActivityFeed = ({ orderId }) => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['orderActivities', orderId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('order_activities')
          .select('*')
          .eq('order_id', orderId)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching order activities:', error);
        return [];
      }
    },
    enabled: !!orderId
  });
  
  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading activities...</div>;
  }
  
  if (!activities || activities.length === 0) {
    return (
      <div className="border-l-2 border-primary pl-4 py-1">
        <p className="font-medium">Order created</p>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString()}
        </p>
      </div>
    );
  }
  
  return (
    <>
      {activities.map((activity) => (
        <div key={activity.id} className="border-l-2 border-primary pl-4 py-1">
          <p className="font-medium">{activity.description}</p>
          <p className="text-sm text-muted-foreground">
            {new Date(activity.created_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </>
  );
};
