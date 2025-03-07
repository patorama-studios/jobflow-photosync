import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Photographer {
  id: number;
  name: string;
  color: string;
  email?: string;
  phone?: string;
  payoutRate?: number;
}

export function usePhotographers() {
  const [photographers, setPhotographers] = useState<Photographer[]>([
    // Default photographers if no data from Supabase
    { id: 1, name: 'Maria Garcia', color: '#4f46e5' },
    { id: 2, name: 'Alex Johnson', color: '#10b981' },
    { id: 3, name: 'Wei Chen', color: '#f59e0b' },
    { id: 4, name: 'Aisha Patel', color: '#ef4444' },
    { id: 5, name: 'Carlos Rodriguez', color: '#8b5cf6' }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPhotographers() {
      try {
        // Try to fetch photographers from Supabase (in a real app, you'd have a dedicated table)
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'photographer');
  
        if (error) {
          throw error;
        }
  
        if (data && data.length > 0) {
          // Map the data to our Photographer interface
          const mappedPhotographers = data.map((profile, index) => ({
            id: index + 1,
            name: profile.full_name || profile.username || `Photographer ${index + 1}`,
            color: getColorForIndex(index),
            email: profile.email,
            payoutRate: 100 // Default payout rate
          }));
          
          setPhotographers(mappedPhotographers);
        }
        // If no data, we'll use the defaults set in the initial state
      } catch (err) {
        console.error('Error fetching photographers:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch photographers'));
        // Keep using the default photographers on error
      } finally {
        setIsLoading(false);
      }
    }

    fetchPhotographers();
  }, []);

  return { photographers, isLoading, error };
}

// Helper function to get a color based on index
function getColorForIndex(index: number): string {
  const colors = [
    '#4f46e5', // Indigo
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#ec4899', // Pink
    '#84cc16', // Lime
    '#6366f1', // Indigo
    '#14b8a6', // Teal
  ];
  
  return colors[index % colors.length];
}
