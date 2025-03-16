
import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/api/supabase-service';

export const useProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Only fetch profile if we have a userId
    if (!userId) {
      return;
    }

    const fetchProfile = async () => {
      try {
        // Use getProfile instead of getUserProfile
        const data = await supabaseService.getProfile(userId);
        
        if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Exception fetching user profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  return profile;
};
