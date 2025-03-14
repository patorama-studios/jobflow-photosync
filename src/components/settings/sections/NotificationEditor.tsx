
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationTemplateProvider } from '@/contexts/NotificationTemplateContext';
import { useNotificationTemplateEffects } from '@/hooks/useNotificationTemplateEffects';
import { LoadingState } from './notification-editor/LoadingState';
import { EditorHeader } from './notification-editor/EditorHeader';
import { TemplateList } from './notification-editor/TemplateList';
import { TemplateEditor } from './notification-editor/TemplateEditor';

export function NotificationEditor() {
  const [currentTab, setCurrentTab] = useState<string>('email');

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <NotificationTemplateProvider>
      <NotificationEditorContent currentTab={currentTab} onTabChange={handleTabChange} />
    </NotificationTemplateProvider>
  );
}

interface NotificationEditorContentProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const NotificationEditorContent: React.FC<NotificationEditorContentProps> = ({ 
  currentTab, 
  onTabChange 
}) => {
  const { loading } = useNotificationTemplateEffects();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <EditorHeader />
      
      <Tabs defaultValue="email" value={currentTab} onValueChange={onTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email">Email Templates</TabsTrigger>
          <TabsTrigger value="sms">SMS Templates</TabsTrigger>
          <TabsTrigger value="push">Push Notification Templates</TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <TemplateList type={currentTab} />
          </div>
          
          <div className="md:col-span-2">
            <TemplateEditor currentTab={currentTab} />
          </div>
        </div>
      </Tabs>
    </div>
  );
};
