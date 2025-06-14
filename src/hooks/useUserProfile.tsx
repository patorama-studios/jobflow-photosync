
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { UserProfile } from './types/user-settings-types';
import { useAuth } from '@/contexts/MySQLAuthContext';
import { profileService } from '@/services/mysql/profile-service';

const DEFAULT_USER_PROFILE: UserProfile = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  title: '',
  avatar: '',
  full_name: '',
  role: ''
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user, session } = useAuth();
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !session) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        console.log('🔧 Fetching profile for user:', user.id);
        
        // Try to get saved profile from MySQL
        const savedProfile = await profileService.getProfile(user.id);
        
        if (savedProfile) {
          console.log('🔧 Using saved profile from MySQL');
          setProfile(savedProfile);
        } else {
          console.log('🔧 No saved profile, creating default from auth data');
          // Create default profile from auth context
          const defaultProfile: UserProfile = {
            id: user.id,
            firstName: user.full_name?.split(' ')[0] || '',
            lastName: user.full_name?.split(' ').slice(1).join(' ') || '',
            email: user.email || '',
            phoneNumber: '',
            title: '',
            avatar: '',
            full_name: user.full_name || '',
            role: 'admin'
          };
          
          // Save the default profile
          await profileService.saveProfile(user.id, defaultProfile);
          setProfile(defaultProfile);
        }
      } catch (error) {
        console.error('🔧 Error loading user profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, session]);
  
  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
    
    // Update firstName/lastName if full_name is provided
    if (updatedProfile.firstName || updatedProfile.lastName) {
      const newFirstName = updatedProfile.firstName || profile.firstName;
      const newLastName = updatedProfile.lastName || profile.lastName;
      const newFullName = `${newFirstName} ${newLastName}`.trim();
      setProfile(prev => ({ ...prev, full_name: newFullName }));
    }
  };
  
  const saveProfile = async () => {
    if (!user || !session) {
      toast.error('You must be logged in to save your profile');
      return false;
    }
    
    setSaving(true);
    try {
      const fullName = `${profile.firstName} ${profile.lastName}`.trim();
      
      const profileToSave: UserProfile = {
        ...profile,
        full_name: fullName,
        updated_at: new Date().toISOString()
      };
      
      console.log('🔧 Saving complete profile to MySQL:', profileToSave);
      
      // Save to MySQL using our persistence service
      const success = await profileService.saveProfile(user.id, profileToSave);
      
      if (success) {
        // Update local state with the saved data
        setProfile(profileToSave);
        console.log('🔧 Profile saved successfully and persisted');
        toast.success('Profile updated successfully');
        return true;
      } else {
        throw new Error('Failed to save profile to database');
      }
    } catch (error) {
      console.error('🔧 Error saving user profile:', error);
      toast.error('Failed to save profile. Please try again.');
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
    saveProfile
  };
}
