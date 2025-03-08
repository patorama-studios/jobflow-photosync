
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from './types/user-settings-types';

const DEFAULT_USER_PROFILE: UserProfile = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  title: '',
  avatar: '',
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('key', 'user_profile')
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching user profile:', error);
          toast.error('Failed to load user profile');
          return;
        }
        
        if (data && data.value) {
          // Properly cast the JSON value to the expected type
          setProfile(data.value as unknown as UserProfile);
        } else {
          // No profile found, use defaults
          setProfile(DEFAULT_USER_PROFILE);
        }
      } catch (error) {
        console.error('Unexpected error loading user profile:', error);
        toast.error('An unexpected error occurred while loading user profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
  };
  
  const saveProfile = async () => {
    setSaving(true);
    try {
      // Check if a profile entry exists first
      const { data: existingData, error: checkError } = await supabase
        .from('app_settings')
        .select('id')
        .eq('key', 'user_profile')
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking for existing profile:', checkError);
        toast.error('Failed to save user profile');
        return false;
      }

      let result;
      
      // Convert the profile object to a plain object to ensure it's stored correctly
      // and ensure it's JSON-safe
      const jsonSafeProfile = JSON.parse(JSON.stringify(profile));
      
      if (existingData) {
        // Update existing profile
        result = await supabase
          .from('app_settings')
          .update({
            value: jsonSafeProfile,
            updated_at: new Date().toISOString()
          })
          .eq('key', 'user_profile');
      } else {
        // Create new profile
        result = await supabase
          .from('app_settings')
          .insert({
            key: 'user_profile',
            value: jsonSafeProfile,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });
      }
      
      if (result.error) {
        console.error('Error saving user profile:', result.error);
        toast.error('Failed to save user profile');
        return false;
      }
      
      toast.success('User profile saved successfully');
      return true;
    } catch (error) {
      console.error('Unexpected error saving user profile:', error);
      toast.error('An unexpected error occurred while saving user profile');
      return false;
    } finally {
      setSaving(false);
    }
  };
  
  return {
    profile,
    loading,
    saving,
    updateProfile,
    saveProfile,
  };
}
