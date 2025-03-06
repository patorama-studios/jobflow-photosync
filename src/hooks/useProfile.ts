
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [userId]);

  return profile;
};
