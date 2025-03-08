
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Skeleton } from "@/components/ui/skeleton";

export function UserSettings() {
  const { profile, loading, saving, updateProfile, saveProfile } = useUserProfile();
  
  const handleSave = async () => {
    await saveProfile();
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your personal information and preferences
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {profile.avatar ? (
            <AvatarImage src={profile.avatar} alt={`${profile.firstName} ${profile.lastName}`} />
          ) : (
            <AvatarFallback className="text-lg">
              {profile.firstName && profile.lastName
                ? `${profile.firstName[0]}${profile.lastName[0]}`
                : "U"}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div>
          <div className="text-lg font-medium">
            {profile.firstName} {profile.lastName}
          </div>
          <div className="text-sm text-muted-foreground">
            {profile.title || "No title set"}
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
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
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={profile.phoneNumber}
              onChange={(e) => updateProfile({ phoneNumber: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              id="title"
              value={profile.title}
              onChange={(e) => updateProfile({ title: e.target.value })}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="avatar">Profile Picture URL</Label>
          <Input
            id="avatar"
            value={profile.avatar || ''}
            onChange={(e) => updateProfile({ avatar: e.target.value })}
            placeholder="https://example.com/avatar.jpg"
          />
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
