
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';
import { useNotificationTemplates } from '@/contexts/NotificationTemplateContext';

export const TemplateEditor: React.FC<{ currentTab: string }> = ({ currentTab }) => {
  const { editedTemplate, setEditedTemplate, isSaving, saveTemplate } = useNotificationTemplates();

  if (!editedTemplate) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-muted/30 rounded-lg p-6">
        <p className="text-muted-foreground">
          Select a template to edit
        </p>
      </div>
    );
  }

  return (
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
            onClick={() => saveTemplate()}
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
  );
};
