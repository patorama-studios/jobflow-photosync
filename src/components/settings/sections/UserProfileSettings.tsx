
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileForm } from "./user-profile/ProfileForm";
import { ProfileActions } from "./user-profile/ProfileActions";
import { LoadingState } from "./user-profile/LoadingState";
import { ErrorState } from "./user-profile/ErrorState";
import { useProfileData } from "./user-profile/useProfileData";

export function UserProfileSettings() {
  const { profile, loading, saving, handleChange, saveProfile } = useProfileData();

  if (loading) {
    return <LoadingState />;
  }
  
  if (!profile) {
    return <ErrorState />;
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <ProfileForm 
          profile={profile} 
          handleChange={handleChange} 
        />
        <ProfileActions 
          saving={saving} 
          saveProfile={saveProfile} 
        />
      </CardContent>
    </Card>
  );
}
