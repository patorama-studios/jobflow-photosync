import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DownloadSettings as DownloadSettingsType } from "@/hooks/types/user-settings-types";
import { useAuth } from "@/contexts/MySQLAuthContext";
import { downloadService } from "@/services/mysql/download-service";

const defaultSettings: DownloadSettingsType = {
  automaticDownloads: false,
  downloadPath: "",
  qualityPreference: "high",
  organizationMethod: "date",
  maxDimension: 2000,
  imageQuality: 80,
  dpi: "300",
  fileNaming: "original"
};

export function DownloadSettings() {
  const [settings, setSettings] = useState<DownloadSettingsType>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user, session } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        if (!user || !session) {
          console.log('🔧 No authenticated user found');
          setLoading(false);
          return;
        }
        
        console.log('🔧 Fetching download settings for user:', user.id);
        const userSettings = await downloadService.getDownloadSettings(user.id);
        setSettings(userSettings);
      } catch (error) {
        console.error('🔧 Failed to fetch download settings:', error);
        toast.error('Failed to load download settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [user, session]);

  const handleChange = (field: keyof DownloadSettingsType, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = async () => {
    if (!user || !session) {
      toast.error('You must be logged in to save settings');
      return;
    }

    setSaving(true);
    try {
      console.log('🔧 Saving download settings to MySQL:', settings);
      
      const success = await downloadService.saveDownloadSettings(user.id, settings);
      
      if (success) {
        toast.success('Download settings saved successfully');
      } else {
        throw new Error('Failed to save settings to database');
      }
    } catch (error) {
      console.error('🔧 Error saving download settings:', error);
      toast.error('Failed to save download settings');
    } finally {
      setSaving(false);
    }
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
        <h2 className="text-2xl font-semibold tracking-tight">Download Settings</h2>
        <p className="text-muted-foreground">
          Customize how images and documents are downloaded and delivered
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="maxDimension">Maximum Dimension (px)</Label>
                <span className="text-sm font-medium">{settings.maxDimension}px</span>
              </div>
              <Slider
                id="maxDimension"
                min={800}
                max={5000}
                step={100}
                value={[settings.maxDimension]}
                onValueChange={(value) => handleChange('maxDimension', value[0])}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Set the maximum width or height for downloaded images
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="imageQuality">Image Quality (%)</Label>
                <span className="text-sm font-medium">{settings.imageQuality}%</span>
              </div>
              <Slider
                id="imageQuality"
                min={50}
                max={100}
                step={5}
                value={[settings.imageQuality]}
                onValueChange={(value) => handleChange('imageQuality', value[0])}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Higher quality means larger file size
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dpi">DPI (Dots Per Inch)</Label>
              <Select
                value={settings.dpi}
                onValueChange={(value) => handleChange('dpi', value)}
              >
                <SelectTrigger id="dpi">
                  <SelectValue placeholder="Select DPI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="72">72 DPI (Web/Screen)</SelectItem>
                  <SelectItem value="150">150 DPI (Medium Quality)</SelectItem>
                  <SelectItem value="300">300 DPI (Print Quality)</SelectItem>
                  <SelectItem value="600">600 DPI (High Quality Print)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                DPI affects print quality but not screen display
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fileNaming">File Naming Convention</Label>
              <Select
                value={settings.fileNaming}
                onValueChange={(value) => handleChange('fileNaming', value)}
              >
                <SelectTrigger id="fileNaming">
                  <SelectValue placeholder="Select file naming convention" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Keep Original Filename</SelectItem>
                  <SelectItem value="order-id">Order ID + Sequence</SelectItem>
                  <SelectItem value="client-date">Client Name + Date</SelectItem>
                  <SelectItem value="property-date">Property Address + Date</SelectItem>
                  <SelectItem value="custom">Custom Format</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {settings.fileNaming === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="customFormat">Custom Format</Label>
                <Input
                  id="customFormat"
                  placeholder="e.g., [client]-[date]-[id]"
                  value={settings.customFormat as string || ''}
                  onChange={(e) => handleChange('customFormat', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Use placeholders: [client], [date], [id], [address], [type]
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button
          onClick={saveSettings}
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Download Settings"
          )}
        </Button>
      </div>
    </div>
  );
}
