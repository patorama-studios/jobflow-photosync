
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface DownloadSettings {
  maxDimension: number;
  imageQuality: number;
  dpi: string;
  fileNaming: string;
}

const DEFAULT_SETTINGS: DownloadSettings = {
  maxDimension: 2048,
  imageQuality: 80,
  dpi: "72",
  fileNaming: "original"
};

export function DownloadSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<DownloadSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          setSettings(DEFAULT_SETTINGS);
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'download_settings')
          .eq('user_id', userData.user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching download settings:', error);
          return;
        }
        
        if (data && data.value) {
          setSettings(data.value as unknown as DownloadSettings);
        }
      } catch (error) {
        console.error('Failed to fetch download settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast({
          title: "Error",
          description: "You must be logged in to save settings",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'download_settings',
          value: settings,
          user_id: userData.user.id,
          updated_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error saving download settings:', error);
        toast({
          title: "Error",
          description: "Failed to save settings",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Download settings updated",
        description: "Your download preferences have been saved.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Download Settings</h2>
        <p className="text-muted-foreground">
          Configure how images and files are processed and named when downloaded
        </p>
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Image Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxDimension">Maximum Image Dimension (pixels)</Label>
              <Input 
                id="maxDimension" 
                type="number" 
                value={settings.maxDimension}
                onChange={(e) => setSettings({
                  ...settings,
                  maxDimension: parseInt(e.target.value) || 1024
                })}
              />
              <p className="text-sm text-muted-foreground">
                The maximum width or height an image can have
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="imageQuality">Image Quality</Label>
                <span className="text-sm text-muted-foreground">{settings.imageQuality}%</span>
              </div>
              <Slider 
                id="imageQuality" 
                value={[settings.imageQuality]} 
                max={100} 
                step={1}
                onValueChange={(values) => setSettings({
                  ...settings,
                  imageQuality: values[0]
                })}
              />
              <p className="text-sm text-muted-foreground">
                Higher quality means larger file size
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dpi">DPI Setting</Label>
              <Select 
                value={settings.dpi}
                onValueChange={(value) => setSettings({
                  ...settings,
                  dpi: value
                })}
              >
                <SelectTrigger id="dpi">
                  <SelectValue placeholder="Select DPI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="72">72 DPI (Web)</SelectItem>
                  <SelectItem value="150">150 DPI (Medium Quality)</SelectItem>
                  <SelectItem value="300">300 DPI (Print Quality)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">File Naming</h3>
          <div className="space-y-4">
            <RadioGroup 
              value={settings.fileNaming}
              onValueChange={(value) => setSettings({
                ...settings,
                fileNaming: value
              })}
              className="space-y-4"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="original" id="naming-original" />
                <div className="grid gap-1">
                  <Label htmlFor="naming-original" className="font-normal">Use original file names from upload</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep the original file names as uploaded by photographers
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="order-room" id="naming-order-room" />
                <div className="grid gap-1">
                  <Label htmlFor="naming-order-room" className="font-normal">Order number + room name</Label>
                  <p className="text-sm text-muted-foreground">
                    Example: ORD12345-Kitchen.jpg
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="address-room" id="naming-address-room" />
                <div className="grid gap-1">
                  <Label htmlFor="naming-address-room" className="font-normal">Address + room name</Label>
                  <p className="text-sm text-muted-foreground">
                    Example: 123-Main-St-Kitchen.jpg
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSave}
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
    </div>
  );
}
