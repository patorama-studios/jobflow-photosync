
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
    
    // Only fetch profile if we have a userId
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        // Use getProfile from supabaseService
        const data = await supabaseService.getProfile(userId);
        
        if (data) {
          setProfile(data);
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
