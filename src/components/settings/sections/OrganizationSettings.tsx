
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOrganizationSettings } from "@/hooks/useOrganizationSettings";

export function OrganizationSettings() {
  const { settings, loading, saving, updateSettings, saveSettings } = useOrganizationSettings();
  
  const handleSave = () => {
    saveSettings();
  };
  
  if (loading) {
    return <div className="py-4">Loading organization settings...</div>;
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
            value={settings.companyName}
            onChange={(e) => updateSettings({ companyName: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input 
            id="website" 
            type="url" 
            value={settings.website}
            onChange={(e) => updateSettings({ website: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="supportEmail">Main Support Email</Label>
          <Input 
            id="supportEmail" 
            type="email" 
            value={settings.supportEmail}
            onChange={(e) => updateSettings({ supportEmail: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companyPhone">Company Phone</Label>
          <Input 
            id="companyPhone" 
            type="tel" 
            value={settings.companyPhone}
            onChange={(e) => updateSettings({ companyPhone: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companyTimezone">Company Timezone</Label>
          <Select 
            value={settings.companyTimezone}
            onValueChange={(value) => updateSettings({ companyTimezone: value })}
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
                value={settings.companyAddress}
                onChange={(e) => updateSettings({ companyAddress: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="addressFormat">Address Format</Label>
              <Select 
                value={settings.addressFormat}
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
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
