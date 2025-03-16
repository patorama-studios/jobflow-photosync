
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/hooks/types/user-settings-types";

interface ProfileFormProps {
  profile: UserProfile;
  handleChange: (field: keyof UserProfile, value: string) => void;
}

export function ProfileForm({ profile, handleChange }: ProfileFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            value={profile.firstName || ''} 
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            value={profile.lastName || ''} 
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          value={profile.email || ''} 
          disabled 
          type="email"
        />
        <p className="text-xs text-muted-foreground">
          Email cannot be changed. Contact support if you need to update your email.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input 
          id="phoneNumber" 
          value={profile.phoneNumber || ''} 
          onChange={(e) => handleChange('phoneNumber', e.target.value)}
          type="tel"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input 
          id="title" 
          value={profile.title || ''} 
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input 
          id="role" 
          value={profile.role || ''} 
          disabled
        />
        <p className="text-xs text-muted-foreground">
          Roles can only be changed by administrators.
        </p>
      </div>
    </div>
  );
}
