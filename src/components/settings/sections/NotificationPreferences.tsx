
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function NotificationPreferences() {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been saved.",
    });
  };
  
  const notificationTypes = [
    "Appointment Assigned",
    "Appointment Canceled",
    "Appointment Postponed",
    "Appointment Reminder",
    "Appointment Rescheduled",
    "Appointment Scheduled",
    "Appointment Summary",
    "Appointment Unassigned",
    "Customer Team Invitation",
    "Order Payment Processed",
    "Order Received",
    "Team Member Invitation",
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Notification Preferences</h2>
        <p className="text-muted-foreground">
          Control which notifications you receive and how you receive them
        </p>
      </div>
      
      <Tabs defaultValue="email">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="push">Push Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email" className="pt-4">
          <div className="space-y-4">
            {notificationTypes.map((type) => (
              <div key={type} className="flex items-start space-x-2">
                <Checkbox id={`email-${type}`} defaultChecked />
                <div className="grid gap-1">
                  <Label htmlFor={`email-${type}`} className="font-normal">
                    {type}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive an email when this event occurs
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sms" className="pt-4">
          <div className="space-y-4">
            {notificationTypes.map((type) => (
              <div key={type} className="flex items-start space-x-2">
                <Checkbox id={`sms-${type}`} />
                <div className="grid gap-1">
                  <Label htmlFor={`sms-${type}`} className="font-normal">
                    {type}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive an SMS when this event occurs
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="push" className="pt-4">
          <div className="space-y-4">
            {notificationTypes.map((type) => (
              <div key={type} className="flex items-start space-x-2">
                <Checkbox id={`push-${type}`} />
                <div className="grid gap-1">
                  <Label htmlFor={`push-${type}`} className="font-normal">
                    {type}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a push notification when this event occurs
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Preferences</Button>
      </div>
    </div>
  );
}
