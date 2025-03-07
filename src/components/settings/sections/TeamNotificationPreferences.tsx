
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react";

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: "appointment-assigned",
    name: "Appointment Assigned",
    description: "When you are assigned to a new appointment",
    channels: { email: true, sms: true, push: true }
  },
  {
    id: "appointment-canceled",
    name: "Appointment Canceled",
    description: "When an appointment is canceled",
    channels: { email: true, sms: true, push: true }
  },
  {
    id: "appointment-postponed",
    name: "Appointment Postponed",
    description: "When an appointment is postponed to a future date",
    channels: { email: true, sms: false, push: true }
  },
  {
    id: "appointment-reminder",
    name: "Appointment Reminder",
    description: "Reminder before an upcoming appointment",
    channels: { email: true, sms: true, push: true }
  },
  {
    id: "appointment-rescheduled",
    name: "Appointment Rescheduled",
    description: "When an appointment time is changed",
    channels: { email: true, sms: true, push: true }
  },
  {
    id: "appointment-scheduled",
    name: "Appointment Scheduled",
    description: "When a new appointment is scheduled",
    channels: { email: true, sms: false, push: true }
  },
  {
    id: "appointment-summary",
    name: "Appointment Summary",
    description: "Summary after an appointment is completed",
    channels: { email: true, sms: false, push: false }
  },
  {
    id: "appointment-unassigned",
    name: "Appointment Unassigned",
    description: "When you are removed from an appointment",
    channels: { email: true, sms: true, push: true }
  },
  {
    id: "customer-team-invitation",
    name: "Customer Team Invitation",
    description: "When a customer adds you to their team",
    channels: { email: true, sms: false, push: true }
  },
  {
    id: "order-payment-processed",
    name: "Order Payment Processed",
    description: "When payment for an order is successful",
    channels: { email: true, sms: false, push: true }
  },
  {
    id: "order-received",
    name: "Order Received",
    description: "When a new order is placed",
    channels: { email: true, sms: false, push: true }
  },
  {
    id: "team-member-invitation",
    name: "Team Member Invitation",
    description: "When you're invited to join a team",
    channels: { email: true, sms: false, push: false }
  },
];

export function TeamNotificationPreferences() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>(DEFAULT_NOTIFICATION_SETTINGS);
  const [activeTab, setActiveTab] = useState("email");
  const [selectedTeamMember, setSelectedTeamMember] = useState("current-user");
  const { toast } = useToast();

  const handleNotificationChange = (settingId: string, channel: keyof NotificationSetting['channels'], value: boolean) => {
    setNotificationSettings(
      notificationSettings.map(setting => 
        setting.id === settingId 
          ? { ...setting, channels: { ...setting.channels, [channel]: value } } 
          : setting
      )
    );
  };

  const savePreferences = () => {
    // In a real app, this would save to a database
    toast({
      title: "Notification preferences saved",
      description: "Your notification settings have been updated",
    });
  };

  const enableAllForChannel = (channel: keyof NotificationSetting['channels']) => {
    setNotificationSettings(
      notificationSettings.map(setting => ({
        ...setting,
        channels: { ...setting.channels, [channel]: true }
      }))
    );
  };

  const disableAllForChannel = (channel: keyof NotificationSetting['channels']) => {
    setNotificationSettings(
      notificationSettings.map(setting => ({
        ...setting,
        channels: { ...setting.channels, [channel]: false }
      }))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Team Notification Preferences</h2>
        <p className="text-muted-foreground">
          Customize how and when you receive notifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Notification Settings</CardTitle>
            
            <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-user">Your Notifications</SelectItem>
                <SelectItem value="team-default">Team Default Settings</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription>
            Control which notifications you receive and how you receive them
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                SMS
              </TabsTrigger>
              <TabsTrigger value="push" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Push
              </TabsTrigger>
            </TabsList>
            
            <div className="mb-4 flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => enableAllForChannel(activeTab as keyof NotificationSetting['channels'])}
              >
                Enable All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => disableAllForChannel(activeTab as keyof NotificationSetting['channels'])}
              >
                Disable All
              </Button>
            </div>
            
            <TabsContent value="email" className="space-y-4">
              {notificationSettings.map((setting) => (
                <div key={setting.id} className="flex items-start space-x-2 py-2 border-b">
                  <Checkbox 
                    id={`email-${setting.id}`} 
                    checked={setting.channels.email}
                    onCheckedChange={(checked) => 
                      handleNotificationChange(setting.id, "email", checked === true)
                    } 
                  />
                  <div className="grid gap-1">
                    <Label htmlFor={`email-${setting.id}`} className="font-normal">
                      {setting.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {setting.description}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="sms" className="space-y-4">
              {notificationSettings.map((setting) => (
                <div key={setting.id} className="flex items-start space-x-2 py-2 border-b">
                  <Checkbox 
                    id={`sms-${setting.id}`} 
                    checked={setting.channels.sms}
                    onCheckedChange={(checked) => 
                      handleNotificationChange(setting.id, "sms", checked === true)
                    } 
                  />
                  <div className="grid gap-1">
                    <Label htmlFor={`sms-${setting.id}`} className="font-normal">
                      {setting.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {setting.description}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="push" className="space-y-4">
              {notificationSettings.map((setting) => (
                <div key={setting.id} className="flex items-start space-x-2 py-2 border-b">
                  <Checkbox 
                    id={`push-${setting.id}`} 
                    checked={setting.channels.push}
                    onCheckedChange={(checked) => 
                      handleNotificationChange(setting.id, "push", checked === true)
                    } 
                  />
                  <div className="grid gap-1">
                    <Label htmlFor={`push-${setting.id}`} className="font-normal">
                      {setting.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {setting.description}
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <MessageSquare className="mr-1 h-4 w-4" />
            <span>Changes will apply to future notifications only</span>
          </div>
          <Button onClick={savePreferences}>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
