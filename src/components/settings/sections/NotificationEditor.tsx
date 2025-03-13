
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useAppSettings } from "@/hooks/useAppSettings";

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'email' | 'sms' | 'push';
  variables: string[];
}

const defaultTemplates: NotificationTemplate[] = [
  {
    id: 'order-created',
    name: 'Order Created',
    subject: 'Your order #{{order_id}} has been created',
    body: 'Hello {{customer_name}},\n\nYour order #{{order_id}} has been created successfully. Our team will process it shortly.\n\nThank you for your business!\n\nRegards,\nThe Team',
    type: 'email',
    variables: ['customer_name', 'order_id', 'order_date', 'order_total']
  },
  {
    id: 'appointment-reminder',
    name: 'Appointment Reminder',
    subject: 'Reminder: Your appointment on {{appointment_date}}',
    body: 'Hello {{customer_name}},\n\nThis is a reminder about your upcoming appointment on {{appointment_date}} at {{appointment_time}}.\n\nLocation: {{appointment_location}}\n\nWe look forward to seeing you!\n\nRegards,\nThe Team',
    type: 'email',
    variables: ['customer_name', 'appointment_date', 'appointment_time', 'appointment_location', 'photographer_name']
  },
  {
    id: 'order-completed-sms',
    name: 'Order Completed (SMS)',
    subject: '',
    body: 'Your order #{{order_id}} is now complete. View your content here: {{content_link}}',
    type: 'sms',
    variables: ['order_id', 'content_link']
  }
];

export function NotificationEditor() {
  const { value: templates, setValue: saveTemplates, loading } = useAppSettings<NotificationTemplate[]>(
    'notification_templates', 
    defaultTemplates
  );
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('email');
  const [isSaving, setIsSaving] = useState(false);
  const [editedTemplate, setEditedTemplate] = useState<NotificationTemplate | null>(null);

  const handleSelectTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setEditedTemplate({...template});
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setSelectedTemplate(null);
    setEditedTemplate(null);
  };

  const handleSaveTemplate = async () => {
    if (!editedTemplate) return;
    
    setIsSaving(true);
    try {
      // Update the template in the templates array
      const newTemplates = templates.map(t => 
        t.id === editedTemplate.id ? editedTemplate : t
      );
      
      // Save to Supabase
      await saveTemplates(newTemplates);
      
      // Update the selected template
      setSelectedTemplate(editedTemplate);
      
      toast.success("Template saved successfully");
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

  const getTemplatesByType = (type: string) => {
    return templates.filter(t => t.type === type);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Notification Editor</h2>
        <p className="text-muted-foreground">
          Customize notification templates for emails, SMS, and push notifications
        </p>
      </div>
      
      <Tabs defaultValue="email" value={currentTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="sms">SMS Templates</TabsTrigger>
          <TabsTrigger value="push">Push Notification Templates</TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <Label className="mb-2 block">Available Templates</Label>
                <div className="space-y-2">
                  {getTemplatesByType(currentTab).map(template => (
                    <Button 
                      key={template.id}
                      variant={selectedTemplate?.id === template.id ? "default" : "outline"}
                      className="w-full justify-start h-auto py-2 px-4"
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <span className="truncate">{template.name}</span>
                    </Button>
                  ))}
                  
                  {getTemplatesByType(currentTab).length === 0 && (
                    <p className="text-sm text-muted-foreground py-2">
                      No templates available for this type.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            {editedTemplate ? (
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input 
                      id="template-name"
                      value={editedTemplate.name}
                      onChange={(e) => setEditedTemplate({
                        ...editedTemplate,
                        name: e.target.value
                      })}
                    />
                  </div>
                  
                  {currentTab === 'email' && (
                    <div className="space-y-2">
                      <Label htmlFor="template-subject">Subject Line</Label>
                      <Input 
                        id="template-subject"
                        value={editedTemplate.subject}
                        onChange={(e) => setEditedTemplate({
                          ...editedTemplate,
                          subject: e.target.value
                        })}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="template-body">Message Content</Label>
                    <Textarea 
                      id="template-body"
                      rows={10}
                      value={editedTemplate.body}
                      onChange={(e) => setEditedTemplate({
                        ...editedTemplate,
                        body: e.target.value
                      })}
                      className="font-mono"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Available Variables</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {editedTemplate.variables.map(variable => (
                        <div key={variable} className="bg-muted px-3 py-1 rounded text-sm">
                          {`{{${variable}}}`}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={handleSaveTemplate}
                      disabled={isSaving}
                      className="w-full sm:w-auto"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Template
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-muted/30 rounded-lg p-6">
                <p className="text-muted-foreground">
                  Select a template to edit
                </p>
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
}
