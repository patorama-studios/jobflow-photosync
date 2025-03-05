
import React from 'react';
import { Upload, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useHeaderSettings } from '@/hooks/useHeaderSettings';

interface LogoUploadSectionProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export function LogoUploadSection({ fileInputRef }: LogoUploadSectionProps) {
  const { toast } = useToast();
  const { settings, updateSettings } = useHeaderSettings();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate file upload - in a real app this would be an API call
    const reader = new FileReader();
    reader.onload = (event) => {
      const logoUrl = event.target?.result as string;
      updateSettings({ ...settings, logoUrl });
      toast({
        title: "Logo uploaded",
        description: "Your company logo has been updated",
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-md font-medium mb-2">Company Logo</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your company logo to display in the header
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        {settings.logoUrl ? (
          <div className="w-16 h-16 rounded-md overflow-hidden border flex items-center justify-center bg-white">
            <img 
              src={settings.logoUrl} 
              alt="Company Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
            <Settings className="h-6 w-6 opacity-50" />
          </div>
        )}
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Logo
          </Button>
          
          {settings.logoUrl && (
            <Button 
              variant="outline" 
              onClick={() => updateSettings({ ...settings, logoUrl: '' })}
              className="text-destructive hover:text-destructive"
            >
              Remove Logo
            </Button>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleLogoUpload}
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>
    </div>
  );
}
