
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
        const { data, error } = await supabaseService.getUserProfile(userId);
        
        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }
        
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
