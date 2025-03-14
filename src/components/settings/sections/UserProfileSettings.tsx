
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { AvatarSection } from "./user-profile/AvatarSection";
import { ProfileForm } from "./user-profile/ProfileForm";
import { ProfileActions } from "./user-profile/ProfileActions";
import { ProfileType } from "./user-profile/types";
import { debounce } from "@/utils/performance-optimizer";

export function UserProfileSettings() {
  const [profile, setProfile] = useState<ProfileType>({
    id: "",
    full_name: "",
    email: "",
    phone: "",
    role: "",
    updated_at: "",
    username: "",
    avatar_url: ""
  });
  
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }
        
        // Fetch auth user info
        const { data: authUser, error: authError } = await supabase.auth.getUser();
        if (authError) {
          throw authError;
        }
        
        // Fetch extended profile info
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        // Merge auth data with profile data
        setProfile({
          ...data,
          email: authUser.user?.email || '',
          phone: data.phone || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, []);
  
  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Saving profile:', profile);
      
      // Update profile in the database
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          username: profile.username,
          phone: profile.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      
      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }
      
      // Check if email has changed
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
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
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
        setProfile={setProfile}
        loading={loading}
      />
      
      <Separator />
      
      <ProfileForm 
        profile={profile} 
        setProfile={setProfile} 
      />
      
      <ProfileActions 
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
}
