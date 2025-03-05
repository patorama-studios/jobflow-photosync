
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Image, Link } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function NotificationEditor() {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Notification template saved",
      description: "Your notification template has been updated successfully.",
    });
  };
  
  const notificationTypes = [
    "Appointment Canceled",
    "Appointment Postponed",
    "Appointment Reminder",
    "Appointment Rescheduled",
    "Appointment Scheduled",
    "Customer Team Invitation",
    "Lead Submitted",
    "Listing Delivered",
    "Order Confirmation",
    "Order Payment Overdue",
    "Order Payment Required",
    "User Activation",
    "User Reset Password",
    "User Verification",
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Notification Editor</h2>
        <p className="text-muted-foreground">
          Customize notification templates for emails, SMS, and push notifications
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="templateType">Notification Type</Label>
          <Select defaultValue={notificationTypes[0]}>
            <SelectTrigger id="templateType">
              <SelectValue placeholder="Select notification type" />
            </SelectTrigger>
            <SelectContent>
              {notificationTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Tabs defaultValue="email">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="push">Push</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailSubject">Email Subject</Label>
                <div className="flex space-x-2">
                  <Input id="emailSubject" defaultValue="Your appointment has been canceled" />
                </div>
              </div>
              
              <div className="border rounded-md p-1">
                <div className="flex flex-wrap gap-1 border-b p-1">
                  <Toggle aria-label="Toggle bold">
                    <Bold className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle italic">
                    <Italic className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle bullet list">
                    <List className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Toggle numbered list">
                    <ListOrdered className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Left align">
                    <AlignLeft className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Center align">
                    <AlignCenter className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Right align">
                    <AlignRight className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Insert image">
                    <Image className="h-4 w-4" />
                  </Toggle>
                  <Toggle aria-label="Insert link">
                    <Link className="h-4 w-4" />
                  </Toggle>
                </div>
                <Textarea 
                  className="border-0 focus-visible:ring-0 min-h-[300px]" 
                  placeholder="Write your email content here..."
                  defaultValue={`Dear {customer_name},\n\nWe're writing to inform you that your appointment scheduled for {appointment_date} at {appointment_time} has been canceled.\n\nIf you have any questions, please contact us at {company_phone}.\n\nBest regards,\n{company_name}`}
                />
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Available shortcodes:</p>
                <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
                  <code className="bg-muted px-1 rounded">{"{customer_name}"}</code>
                  <code className="bg-muted px-1 rounded">{"{appointment_date}"}</code>
                  <code className="bg-muted px-1 rounded">{"{appointment_time}"}</code>
                  <code className="bg-muted px-1 rounded">{"{company_name}"}</code>
                  <code className="bg-muted px-1 rounded">{"{company_phone}"}</code>
                  <code className="bg-muted px-1 rounded">{"{company_email}"}</code>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Test Email</Button>
                <Button variant="outline">Preview</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sms" className="pt-4">
            <div className="space-y-4">
              <Textarea 
                placeholder="Write your SMS content here..."
                className="min-h-[150px]"
                defaultValue={`{company_name}: Your appointment on {appointment_date} at {appointment_time} has been canceled. Questions? Call us at {company_phone}.`}
              />
              
              <div>
                <p className="text-sm font-medium mb-2">Available shortcodes:</p>
                <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
                  <code className="bg-muted px-1 rounded">{"{customer_name}"}</code>
                  <code className="bg-muted px-1 rounded">{"{appointment_date}"}</code>
                  <code className="bg-muted px-1 rounded">{"{appointment_time}"}</code>
                  <code className="bg-muted px-1 rounded">{"{company_name}"}</code>
                  <code className="bg-muted px-1 rounded">{"{company_phone}"}</code>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Test SMS</Button>
                <Button variant="outline">Preview</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="push" className="pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pushTitle">Notification Title</Label>
                <Input id="pushTitle" defaultValue="Appointment Canceled" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pushBody">Notification Body</Label>
                <Textarea 
                  id="pushBody"
                  placeholder="Write your push notification content here..."
                  className="min-h-[100px]"
                  defaultValue={`Your appointment on {appointment_date} at {appointment_time} has been canceled.`}
                />
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Available shortcodes:</p>
                <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
                  <code className="bg-muted px-1 rounded">{"{appointment_date}"}</code>
                  <code className="bg-muted px-1 rounded">{"{appointment_time}"}</code>
                  <code className="bg-muted px-1 rounded">{"{company_name}"}</code>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline">Test Push</Button>
                <Button variant="outline">Preview</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Template</Button>
      </div>
    </div>
  );
}

// Helper component for Input
function Input(props) {
  return <input {...props} className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.className || ""}`} />;
}
