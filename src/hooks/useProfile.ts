
import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/api/supabase-service';

export const useProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset states when userId changes
    setIsLoading(true);
    setError(null);
    setProfile(null);
    
    // Only fetch profile if we have a userId
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log('Fetching profile for userId:', userId);
        // Use getProfile from supabaseService
        const data = await supabaseService.getProfile(userId);
        
        if (data) {
          console.log('Profile data received:', data);
          setProfile(data);
        } else {
          console.log('No profile data found for user');
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Exception fetching user profile:', error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, isLoading, error };
};
