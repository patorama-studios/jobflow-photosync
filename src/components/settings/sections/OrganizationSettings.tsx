
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrganizationSettings } from "@/hooks/useOrganizationSettings";
import { Loader2, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export function OrganizationSettings() {
  const { settings, loading, updateSettings, fetchSettings } = useOrganizationSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState<any>(null);
  const { user, profile } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    if (profile) {
      setIsAdmin(profile.role === 'admin');
    }
  }, [profile]);
  
  useEffect(() => {
    if (settings) {
      setLocalSettings({...settings});
    }
  }, [settings]);
  
  const handleChange = (key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSave = async () => {
    if (!isAdmin) {
      toast.error("Only admins can update organization settings");
      return;
    }
    
    setIsSaving(true);
    try {
      const success = await updateSettings(localSettings);
      if (success) {
        toast.success("Organization settings saved successfully");
        await fetchSettings(); // Refresh settings from server
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("An error occurred while saving settings");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading organization settings...</p>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertTriangle className="h-8 w-8 text-amber-500" />
        <p className="text-lg font-medium">Admin Access Required</p>
        <p className="text-muted-foreground text-center max-w-md">
          Only administrators can view and manage organization settings.
        </p>
      </div>
    );
  }
  
  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];
  
  const addressFormats = [
    "One-line format: {street}, {city}, {state} {postal_code}",
    "Two-line format: {street}\n{city}, {state} {postal_code}",
    "Detailed format: {street}\n{city}, {state}\n{postal_code}\n{country}",
  ];
  
  if (!localSettings) return null;
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Organization Settings</h2>
        <p className="text-muted-foreground">
          Manage your company details and preferences
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Basic information about your organization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input 
              id="companyName" 
              value={localSettings.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input 
              id="website" 
              type="url" 
              value={localSettings.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input 
              id="supportEmail" 
              type="email" 
              value={localSettings.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyPhone">Company Phone</Label>
            <Input 
              id="companyPhone" 
              type="tel" 
              value={localSettings.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyTimezone">Company Timezone</Label>
            <Select 
              value={localSettings.timezone || 'America/New_York'}
              onValueChange={(value) => handleChange('timezone', value)}
            >
              <SelectTrigger id="companyTimezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((timezone) => (
                  <SelectItem key={timezone} value={timezone}>
                    {timezone.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Address Information</CardTitle>
          <CardDescription>Company address and format preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyAddress">Company Address</Label>
            <Textarea 
              id="companyAddress" 
              value={localSettings.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="addressFormat">Address Format</Label>
            <Select 
              value={localSettings.addressFormat || addressFormats[0]}
              onValueChange={(value) => handleChange('addressFormat', value)}
            >
              <SelectTrigger id="addressFormat">
                <SelectValue placeholder="Select address format" />
              </SelectTrigger>
              <SelectContent>
                {addressFormats.map((format) => (
                  <SelectItem key={format} value={format}>
                    {format.split(":")[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              Available shortcodes: {"{street}"}, {"{city}"}, {"{state}"}, {"{postal_code}"}, {"{country}"}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Organization Settings
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
