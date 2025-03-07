
import React from 'react';
import { Upload, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface HeaderSettings {
  height: number;
  color: string;
  logoUrl: string;
  showCompanyName: boolean;
}

interface LogoUploadSectionProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  settings: HeaderSettings;
  updateSettings: (newSettings: Partial<HeaderSettings>) => void;
}

export function LogoUploadSection({ 
  fileInputRef, 
  settings, 
  updateSettings 
}: LogoUploadSectionProps) {
  const { toast } = useToast();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate file upload - in a real app this would be an API call
    const reader = new FileReader();
    reader.onload = (event) => {
      const logoUrl = event.target?.result as string;
      updateSettings({ logoUrl });
      toast({
        title: "Logo selected",
        description: "Click Save to update your company logo",
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
              onClick={() => updateSettings({ logoUrl: '' })}
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
