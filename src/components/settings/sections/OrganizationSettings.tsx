
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrganizationSettings } from "@/hooks/useOrganizationSettings";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function OrganizationSettings() {
  const { settings, loading, updateSettings } = useOrganizationSettings();
  const [isSaving, setIsSaving] = useState(false);
  const [loadRetry, setLoadRetry] = useState(0); // Add a retry mechanism
  
  // Force refresh if loading takes too long
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setLoadRetry(prev => prev + 1);
        toast.info("Refreshing organization settings data...");
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [loading, loadRetry]);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await updateSettings(settings);
      if (success) {
        toast.success("Organization settings saved successfully");
      } else {
        toast.error("Failed to save organization settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("An unexpected error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Loading organization settings...</p>
        {loadRetry > 1 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLoadRetry(prev => prev + 1)}
          >
            Retry Loading
          </Button>
        )}
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
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Organization Settings</h2>
        <p className="text-muted-foreground">
          Manage your company details and preferences
        </p>
      </div>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input 
            id="companyName" 
            value={settings.name || ''}
            onChange={(e) => updateSettings({ name: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input 
            id="website" 
            type="url" 
            value={settings.website || ''}
            onChange={(e) => updateSettings({ website: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supportEmail">Main Support Email</Label>
          <Input 
            id="supportEmail" 
            type="email" 
            value={settings.email || ''}
            onChange={(e) => updateSettings({ email: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companyPhone">Company Phone</Label>
          <Input 
            id="companyPhone" 
            type="tel" 
            value={settings.phone || ''}
            onChange={(e) => updateSettings({ phone: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companyTimezone">Company Timezone</Label>
          <Select 
            value={settings.timezone as string || ''}
            onValueChange={(value) => updateSettings({ timezone: value })}
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
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-4">Address Settings</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Textarea 
                id="companyAddress" 
                value={settings.address || ''}
                onChange={(e) => updateSettings({ address: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="addressFormat">Address Format</Label>
              <Select 
                value={settings.addressFormat as string || ''}
                onValueChange={(value) => updateSettings({ addressFormat: value })}
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
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}
