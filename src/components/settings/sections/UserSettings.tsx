
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Camera } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";

export function UserSettings() {
  const { profile, loading, updateProfile, saveProfile } = useUserProfile();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  if (loading || !profile) {
    return <div className="flex justify-center items-center h-40">Loading user profile...</div>;
  }
  
  const handleSavePassword = async () => {
    // This would be implemented with supabase auth.updateUser
    // But we'll just show a simple flow for now
    setChangingPassword(true);
    
    // Simulate API call
    setTimeout(() => {
      setChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1000);
  };
  
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
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">User Details</h2>
        <p className="text-muted-foreground">
          Manage your personal information and account preferences
        </p>
      </div>
      
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
            <User className="h-16 w-16 text-muted-foreground" />
          </div>
          <Button 
            size="sm" 
            className="absolute bottom-0 right-0 rounded-full p-2" 
            variant="secondary"
          >
            <Camera className="h-4 w-4" />
            <span className="sr-only">Upload avatar</span>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            value={profile.firstName}
            onChange={(e) => updateProfile({ firstName: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            value={profile.lastName}
            onChange={(e) => updateProfile({ lastName: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={profile.email}
            onChange={(e) => updateProfile({ email: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            type="tel" 
            value={profile.phoneNumber}
            onChange={(e) => updateProfile({ phoneNumber: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select 
            value={profile.timezone}
            onValueChange={(value) => updateProfile({ timezone: value })}
          >
            <SelectTrigger id="timezone">
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
      </div>
      
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-4">Change Password</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input 
              id="currentPassword" 
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input 
              id="newPassword" 
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSavePassword} 
          disabled={changingPassword || !currentPassword || !newPassword || newPassword !== confirmPassword}
        >
          {changingPassword ? "Saving..." : "Change Password"}
        </Button>
      </div>
      
      <div className="flex justify-end mt-8 pt-4 border-t">
        <Button onClick={() => saveProfile()}>
          Save Profile
        </Button>
      </div>
    </div>
  );
}
