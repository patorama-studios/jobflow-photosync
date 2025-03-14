
import React, { createContext, useContext, useState } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { toast } from 'sonner';

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'email' | 'sms' | 'push';
  variables: string[];
}

interface NotificationTemplateContextType {
  templates: NotificationTemplate[];
  selectedTemplate: NotificationTemplate | null;
  editedTemplate: NotificationTemplate | null;
  loading: boolean;
  isSaving: boolean;
  loadRetry: number;
  setSelectedTemplate: (template: NotificationTemplate) => void;
  setEditedTemplate: (template: NotificationTemplate | null) => void;
  saveTemplate: () => Promise<void>;
  refreshTemplates: () => void;
  setLoadRetry: React.Dispatch<React.SetStateAction<number>>;
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

const NotificationTemplateContext = createContext<NotificationTemplateContextType | undefined>(undefined);

export const useNotificationTemplates = () => {
  const context = useContext(NotificationTemplateContext);
  if (!context) {
    throw new Error('useNotificationTemplates must be used within a NotificationTemplateProvider');
  }
  return context;
};

export const NotificationTemplateProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { value: templates, setValue: saveTemplates, loading } = useAppSettings<NotificationTemplate[]>(
    'notification_templates', 
    defaultTemplates
  );
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [editedTemplate, setEditedTemplate] = useState<NotificationTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loadRetry, setLoadRetry] = useState(0);

  const saveTemplate = async () => {
    if (!editedTemplate) return;
    
    setIsSaving(true);
    try {
      // Update the template in the templates array
      const newTemplates = templates.map(t => 
        t.id === editedTemplate.id ? editedTemplate : t
      );
      
      // Save to Supabase
      const success = await saveTemplates(newTemplates);
      
      if (success) {
        // Update the selected template
        setSelectedTemplate(editedTemplate);
        toast.success("Template saved successfully");
      } else {
        throw new Error("Failed to save template");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

  const refreshTemplates = () => {
    setLoadRetry(prev => prev + 1);
    toast.info("Refreshing templates...");
  };

  return (
    <NotificationTemplateContext.Provider
      value={{
        templates,
        selectedTemplate,
        editedTemplate,
        loading,
        isSaving,
        loadRetry,
        setSelectedTemplate,
        setEditedTemplate,
        saveTemplate,
        refreshTemplates,
        setLoadRetry,
      }}
    >
      {children}
    </NotificationTemplateContext.Provider>
  );
};
