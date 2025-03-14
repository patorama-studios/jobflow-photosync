
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, AlertCircle } from "lucide-react";
import { AvatarSection } from "./user-profile/AvatarSection";
import { ProfileForm } from "./user-profile/ProfileForm";
import { ProfileActions } from "./user-profile/ProfileActions";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UserProfileSettings() {
  const { profile, loading, saving, updateProfile, saveProfile, isAuthenticated } = useUserProfile();
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [originalEmail, setOriginalEmail] = useState("");
  
  useEffect(() => {
    // Store the original email when profile loads
    if (profile.email) {
      setOriginalEmail(profile.email);
    }
  }, [profile.email]);
  
  // Check if email has changed
  useEffect(() => {
    if (originalEmail && profile.email !== originalEmail) {
      setIsEmailChanged(true);
    } else {
      setIsEmailChanged(false);
    }
  }, [profile.email, originalEmail]);
  
  const handleSave = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to save your profile");
      return;
    }
    
    try {
      // Save profile data to profiles table
      const success = await saveProfile();
      
      if (!success) {
        throw new Error('Failed to update profile');
      }
      
      // Check if email has changed
      if (isEmailChanged) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email !== profile.email) {
          // Update email in auth
          const { error: emailError } = await supabase.auth.updateUser({
            email: profile.email
          });
          
          if (emailError) {
            console.error('Error updating email:', emailError);
            throw emailError;
          }
          
          // Show additional toast about email verification
          toast.info('A verification email has been sent to your new email address');
        }
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <Card className="p-6">
        <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="h-12 w-12 text-amber-500" />
          <h3 className="text-xl font-medium">Authentication Required</h3>
          <p className="text-muted-foreground text-center">
            You need to be logged in to view and edit your profile.
          </p>
          <Button 
            onClick={() => {
              // Redirect to login or open login modal
              toast.info("Please log in to access your profile settings");
            }}
          >
            Log In
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">User Profile</h2>
        <p className="text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>
      
      <AvatarSection 
        profile={profile} 
        setProfile={updateProfile}
        loading={loading}
      />
      
      <Separator />
      
      <ProfileForm 
        profile={profile} 
        setProfile={updateProfile} 
      />
      
      <ProfileActions 
        onSave={handleSave}
        saving={saving}
      />
      
      {isEmailChanged && (
        <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Email Address Change</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  You've changed your email address. After saving, a verification email 
                  will be sent to your new address. You'll need to verify the new email 
                  before you can use it to log in.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
