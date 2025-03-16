
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingState } from "./user-profile/LoadingState";
import { ErrorState } from "./user-profile/ErrorState";
import { ProfileForm } from "./user-profile/ProfileForm";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { ProfileActions } from "./user-profile/ProfileActions";
import { toast } from "sonner";
import { AvatarSection } from "./user-profile/AvatarSection";

export function UserProfileSettings() {
  const { user, isLoading: authLoading } = useAuth();
  const { 
    profile, 
    loading: profileLoading, 
    saving, 
    updateProfile, 
    saveProfile 
  } = useUserProfile();
  
  const isLoading = authLoading || profileLoading;
  
  // Show loading state while user or profile is being fetched
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Show error state if no profile was found or user is not authenticated
  if (!isLoading && (!user || !profile)) {
    return <ErrorState />;
  }
  
  const handleChange = (field, value) => {
    updateProfile({ [field]: value });
  };
  
  const handleSave = async () => {
    const success = await saveProfile();
    if (success) {
      toast.success("Profile updated successfully");
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account details and preferences.
        </p>
      </div>
      
      {profile && (
        <>
          <Card className="p-6">
            <AvatarSection 
              profile={profile} 
              setProfile={(newProfile) => updateProfile(newProfile)} 
              loading={isLoading}
            />
          </Card>
          
          <Card className="p-6">
            <ProfileForm 
              profile={profile} 
              handleChange={handleChange} 
            />
            <div className="mt-6">
              <ProfileActions 
                saving={saving} 
                saveProfile={handleSave} 
              />
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
