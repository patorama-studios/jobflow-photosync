
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useNotificationTemplates } from '@/contexts/NotificationTemplateContext';

export const TemplateList: React.FC<{ type: string }> = ({ type }) => {
  const { templates, selectedTemplate, setSelectedTemplate, setEditedTemplate } = useNotificationTemplates();

  const handleSelectTemplate = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
    setEditedTemplate({...template});
  };

  const getTemplatesByType = (type: string) => {
    return templates.filter(t => t.type === type);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Label className="mb-2 block">Available Templates</Label>
        <div className="space-y-2">
          {getTemplatesByType(type).map(template => (
            <Button 
              key={template.id}
              variant={selectedTemplate?.id === template.id ? "default" : "outline"}
              className="w-full justify-start h-auto py-2 px-4"
              onClick={() => handleSelectTemplate(template)}
            >
              <span className="truncate">{template.name}</span>
            </Button>
          ))}
          
          {getTemplatesByType(type).length === 0 && (
            <p className="text-sm text-muted-foreground py-2">
              No templates available for this type.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
