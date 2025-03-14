
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileType } from "@/hooks/types/user-settings-types";

export function useProfileData() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No user found');
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        // Transform to match our ProfileType format
        const profileData: ProfileType = {
          id: data.id,
          firstName: data.full_name?.split(' ')[0] || '',
          lastName: data.full_name?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',  // Get email from the auth user object
          phoneNumber: data.phone || '',
          title: data.role || '',
          avatar: data.avatar_url || '',
          full_name: data.full_name || '',
          role: data.role || 'user'
        };
        
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (field: keyof ProfileType, value: string) => {
    if (!profile) return;
    
    if (field === 'firstName' || field === 'lastName') {
      const newFirstName = field === 'firstName' ? value : profile.firstName;
      const newLastName = field === 'lastName' ? value : profile.lastName;
      const newFullName = `${newFirstName} ${newLastName}`.trim();
      
      setProfile({
        ...profile,
        [field]: value,
        full_name: newFullName
      });
    } else {
      setProfile({
        ...profile,
        [field]: value
      });
    }
  };

  // Save profile
  const saveProfile = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phoneNumber,
          role: profile.title || profile.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    handleChange,
    saveProfile
  };
}
