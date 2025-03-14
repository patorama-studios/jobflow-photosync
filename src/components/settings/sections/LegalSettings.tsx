
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LegalSettings as LegalSettingsType } from "@/hooks/types/user-settings-types";
import { toast } from "sonner";

const defaultSettings: LegalSettingsType = {
  termsUrl: "",
  privacyUrl: "",
  cookiePolicy: "",
  dataRetentionPeriod: 365,
  termsOfService: "",
  privacyPolicy: "",
  disclaimers: ""
};

export function LegalSettings() {
  const [settings, setSettings] = useState<LegalSettingsType>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          return;
        }
        
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('key', 'legal_settings')
          .eq('user_id', userData.user.id)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching legal settings:', error);
          return;
        }
        
        if (data && data.value) {
          const loadedSettings = data.value as Record<string, any>;
          setSettings({
            termsUrl: loadedSettings.termsUrl || "",
            privacyUrl: loadedSettings.privacyUrl || "",
            cookiePolicy: loadedSettings.cookiePolicy || "",
            dataRetentionPeriod: loadedSettings.dataRetentionPeriod || 365,
            termsOfService: loadedSettings.termsOfService || "",
            privacyPolicy: loadedSettings.privacyPolicy || "",
            disclaimers: loadedSettings.disclaimers || ""
          });
        }
      } catch (error) {
        console.error('Failed to fetch legal settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleChange = (field: keyof LegalSettingsType, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error('You must be logged in to save settings');
        return;
      }
      
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'legal_settings',
          value: settings,
          user_id: userData.user.id,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      toast.success('Legal settings saved successfully');
    } catch (error) {
      console.error('Error saving legal settings:', error);
      toast.error('Failed to save legal settings');
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
        <h2 className="text-2xl font-semibold tracking-tight">Legal Settings</h2>
        <p className="text-muted-foreground">
          Manage legal policies and disclaimers for your organization
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="terms">Terms of Service</Label>
            <Textarea
              id="terms"
              placeholder="Enter your Terms of Service text..."
              rows={6}
              value={settings.termsOfService}
              onChange={(e) => handleChange('termsOfService', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="privacy">Privacy Policy</Label>
            <Textarea
              id="privacy"
              placeholder="Enter your Privacy Policy text..."
              rows={6}
              value={settings.privacyPolicy}
              onChange={(e) => handleChange('privacyPolicy', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cookies">Cookie Policy</Label>
            <Textarea
              id="cookies"
              placeholder="Enter your Cookie Policy text..."
              rows={4}
              value={settings.cookiePolicy}
              onChange={(e) => handleChange('cookiePolicy', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="disclaimers">Disclaimers</Label>
            <Textarea
              id="disclaimers"
              placeholder="Enter your disclaimers text..."
              rows={4}
              value={settings.disclaimers}
              onChange={(e) => handleChange('disclaimers', e.target.value)}
            />
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
            "Save Legal Settings"
          )}
        </Button>
      </div>
    </div>
  );
}

