import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from './types/user-settings-types';
import { supabaseService } from '@/services/api/supabase-service';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const isAuthed = !!data.user;
        setIsAuthenticated(isAuthed);
        if (isAuthed && data.user) {
          setUserId(data.user.id);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !userId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const profileData = await supabaseService.getProfile(userId);
        
        if (profileData) {
          const { data: authData } = await supabase.auth.getUser();
          
          setProfile({
            id: profileData.id || userId,
            firstName: profileData.full_name?.split(' ')[0] || '',
            lastName: profileData.full_name?.split(' ').slice(1).join(' ') || '',
            email: authData.user?.email || '',
            phoneNumber: profileData.phone || '',
            title: profileData.role || '',
            avatar: profileData.avatar_url || '',
          });
        } else {
          const { data, error } = await supabase
            .from('app_settings')
            .select('*')
            .eq('key', 'user_profile')
            .eq('user_id', userId)
            .maybeSingle();
          
          if (!error && data?.value) {
            setProfile(data.value as unknown as UserProfile);
          } else {
            setProfile({
              ...DEFAULT_USER_PROFILE,
              id: userId
            });
          }
        }
      } catch (error) {
        console.error('Unexpected error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [isAuthenticated, userId]);
  
  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
  };
  
  const saveProfile = async () => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to save your profile');
      return false;
    }
    
    setSaving(true);
    try {
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();
      
      const profileData = {
        id: profile.id,
        full_name: fullName,
        avatar_url: profile.avatar,
        phone: profile.phoneNumber,
        username: profile.email?.split('@')[0] || '',
      };
      
      const success = await supabaseService.updateProfile(profile.id, profileData);
      
      if (!success) {
        throw new Error('Failed to update user profile');
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
    isAuthenticated
  };
}
