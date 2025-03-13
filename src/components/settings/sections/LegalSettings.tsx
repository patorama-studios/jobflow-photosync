
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface LegalSettings {
  termsOfService: string;
  privacyPolicy: string;
  cookiePolicy: string;
  disclaimers: string;
}

const DEFAULT_LEGAL_SETTINGS: LegalSettings = {
  termsOfService: 'Enter your terms of service here...',
  privacyPolicy: 'Enter your privacy policy here...',
  cookiePolicy: 'Enter your cookie policy here...',
  disclaimers: 'Enter any disclaimers here...'
};

export function LegalSettings() {
  const { toast } = useToast();
  const [legalSettings, setLegalSettings] = useState<LegalSettings>(DEFAULT_LEGAL_SETTINGS);
  const [activeTab, setActiveTab] = useState('termsOfService');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchLegalSettings = async () => {
      try {
        setLoading(true);
        const { data: userData } = await supabase.auth.getUser();
        
        if (!userData.user) {
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'legal_settings')
          .eq('user_id', userData.user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching legal settings:', error);
          return;
        }
        
        if (data && data.value) {
          setLegalSettings(data.value as LegalSettings);
        }
      } catch (error) {
        console.error('Failed to fetch legal settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLegalSettings();
  }, []);

  const saveSettings = async () => {
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
          key: 'legal_settings',
          value: legalSettings,
          user_id: userData.user.id,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error saving legal settings:', error);
        toast({
          title: "Error",
          description: "Failed to save legal settings",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Legal settings saved",
        description: "Your legal document settings have been updated.",
      });
    } catch (error) {
      console.error('Error saving legal settings:', error);
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
        <h2 className="text-2xl font-semibold tracking-tight">Legal Documents</h2>
        <p className="text-muted-foreground">
          Manage legal documents displayed on your platform
        </p>
      </div>
      
      <Separator />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="termsOfService">Terms of Service</TabsTrigger>
          <TabsTrigger value="privacyPolicy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="cookiePolicy">Cookie Policy</TabsTrigger>
          <TabsTrigger value="disclaimers">Disclaimers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="termsOfService" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your terms of service document that outlines the rules and guidelines for using your service.
          </p>
          <Textarea 
            value={legalSettings.termsOfService}
            onChange={e => setLegalSettings({...legalSettings, termsOfService: e.target.value})}
            className="min-h-[400px] font-mono text-sm"
          />
        </TabsContent>
        
        <TabsContent value="privacyPolicy" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your privacy policy that informs users about how you collect, use, and protect their data.
          </p>
          <Textarea 
            value={legalSettings.privacyPolicy}
            onChange={e => setLegalSettings({...legalSettings, privacyPolicy: e.target.value})}
            className="min-h-[400px] font-mono text-sm"
          />
        </TabsContent>
        
        <TabsContent value="cookiePolicy" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your cookie policy that explains how your platform uses cookies and similar technologies.
          </p>
          <Textarea 
            value={legalSettings.cookiePolicy}
            onChange={e => setLegalSettings({...legalSettings, cookiePolicy: e.target.value})}
            className="min-h-[400px] font-mono text-sm"
          />
        </TabsContent>
        
        <TabsContent value="disclaimers" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Additional disclaimers, legal notices, or statements for your platform.
          </p>
          <Textarea 
            value={legalSettings.disclaimers}
            onChange={e => setLegalSettings({...legalSettings, disclaimers: e.target.value})}
            className="min-h-[400px] font-mono text-sm"
          />
        </TabsContent>
      </Tabs>
      
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
