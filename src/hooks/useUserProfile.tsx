
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  timezone: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First try to get the profile from our app_settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'user_profile')
          .eq('user_id', user.id)
          .single();

        if (!settingsError && settingsData) {
          setProfile(settingsData.value as UserProfile);
          setLoading(false);
          return;
        }

        // If not found in app_settings, try to get from auth user metadata
        const userMetadata = user?.user_metadata || {};
        const authUserEmail = user?.email || '';
        
        // Create a default profile from auth data
        const defaultProfile: UserProfile = {
          id: user.id,
          firstName: userMetadata.first_name || '',
          lastName: userMetadata.last_name || '',
          email: authUserEmail,
          phone: userMetadata.phone || '',
          timezone: 'America/New_York'
        };

        setProfile(defaultProfile);

        // Save this default profile to app_settings for future use
        await supabase
          .from('app_settings')
          .insert({
            key: 'user_profile',
            value: defaultProfile,
            user_id: user.id,
            is_global: false
          });

      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const updateProfile = async (updatedProfile: Partial<UserProfile>) => {
    if (!user || !profile) return;

    try {
      setLoading(true);

      // Merge existing profile with updates
      const newProfile = { ...profile, ...updatedProfile };

      // Save to app_settings
      const { error } = await supabase
        .from('app_settings')
        .update({ 
          value: newProfile,
          updated_at: new Date().toISOString()
        })
        .eq('key', 'user_profile')
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setProfile(newProfile);

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

    } catch (error) {
      console.error('Error updating user profile:', error);
      
      toast({
        title: "Update failed",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    updateProfile
  };
}
