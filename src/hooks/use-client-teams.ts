
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TeamMember } from "@/components/clients/mock-data";

export function useClientTeams() {
  const [allClients, setAllClients] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllPotentialMembers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id, name, email, photo_url')
        .order('name', { ascending: true });

      if (error) throw error;
      
      const members: TeamMember[] = (data || []).map(client => ({
        id: client.id,
        name: client.name,
        email: client.email,
        photoUrl: client.photo_url || '',
        role: 'Admin'
      }));
      
      setAllClients(members);
      return members;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch potential team members');
      console.error("Error fetching potential team members:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize by fetching all clients
  useEffect(() => {
    fetchAllPotentialMembers();
  }, []);

  return {
    allClients,
    isLoading,
    error,
    refetch: fetchAllPotentialMembers
  };
}
