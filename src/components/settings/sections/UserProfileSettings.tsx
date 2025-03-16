
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingState } from "./user-profile/LoadingState";
import { ErrorState } from "./user-profile/ErrorState";
import { ProfileForm } from "./user-profile/ProfileForm";

export function UserProfileSettings() {
  const { user, profile, isLoading } = useAuth();
  
  // Show loading state while profile is being fetched
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Show error state if user is authenticated but no profile was found
  if (!isLoading && user && !profile) {
    return <ErrorState />;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account details and preferences.
        </p>
      </div>
      
      {profile && <ProfileForm profile={profile} />}
    </div>
  );
}
