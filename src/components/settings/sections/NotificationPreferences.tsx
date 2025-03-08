
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotificationSettings } from "@/hooks/useNotificationSettings";

export function NotificationPreferences() {
  const { 
    settings, 
    loading, 
    updateChannelForType,
    notificationTypes
  } = useNotificationSettings();
  
  if (loading) {
    return <div className="flex justify-center items-center h-40">Loading notification settings...</div>;
  }
  
  const getSettingForType = (type: string) => {
    return settings.find(s => s.type === type) || {
      type,
      channels: { email: false, sms: false, push: false }
    };
  };
  
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
            {notificationTypes.map((type) => {
              const setting = getSettingForType(type);
              return (
                <div key={type} className="flex items-start space-x-2">
                  <Checkbox 
                    id={`email-${type}`} 
                    checked={setting.channels.email}
                    onCheckedChange={(checked) => 
                      updateChannelForType(type, 'email', checked === true)
                    }
                  />
                  <div className="grid gap-1">
                    <Label htmlFor={`email-${type}`} className="font-normal">
                      {type}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive an email when this event occurs
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="sms" className="pt-4">
          <div className="space-y-4">
            {notificationTypes.map((type) => {
              const setting = getSettingForType(type);
              return (
                <div key={type} className="flex items-start space-x-2">
                  <Checkbox 
                    id={`sms-${type}`} 
                    checked={setting.channels.sms}
                    onCheckedChange={(checked) => 
                      updateChannelForType(type, 'sms', checked === true)
                    }
                  />
                  <div className="grid gap-1">
                    <Label htmlFor={`sms-${type}`} className="font-normal">
                      {type}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive an SMS when this event occurs
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="push" className="pt-4">
          <div className="space-y-4">
            {notificationTypes.map((type) => {
              const setting = getSettingForType(type);
              return (
                <div key={type} className="flex items-start space-x-2">
                  <Checkbox 
                    id={`push-${type}`} 
                    checked={setting.channels.push}
                    onCheckedChange={(checked) => 
                      updateChannelForType(type, 'push', checked === true)
                    }
                  />
                  <div className="grid gap-1">
                    <Label htmlFor={`push-${type}`} className="font-normal">
                      {type}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a push notification when this event occurs
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
