
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Customer, TeamMember } from '@/components/clients/mock-data';
import { toast } from 'sonner';

export function useClientTeams() {
  const [allClients, setAllClients] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch all client data for team assignment
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would fetch from the database
        // For now, fetch from mock data source
        const { data, error } = await supabase
          .from('clients')
          .select('*');
        
        if (error) throw error;
        
        // Map to TeamMember structure
        const teamMembers: TeamMember[] = (data || []).map((client: any) => ({
          id: client.id,
          name: client.name || 'Unknown',
          email: client.email || 'no-email@example.com',
          role: 'Member',
          dateAdded: client.created_at || new Date().toISOString(),
          photoUrl: client.photo_url || '',
          status: client.is_active ? 'Active' : 'Inactive'
        }));
        
        setAllClients(teamMembers);
      } catch (error) {
        console.error("Error fetching clients for team assignment:", error);
        // Fallback to mock data
        const mockTeamMembers: TeamMember[] = [
          {
            id: "tm1",
            name: "Alex Johnson",
            email: "alex@example.com",
            role: "Member",
            dateAdded: "2023-05-15",
            photoUrl: "",
            status: "Active"
          },
          {
            id: "tm2",
            name: "Maria Garcia",
            email: "maria@example.com",
            role: "Member",
            dateAdded: "2023-06-20",
            photoUrl: "",
            status: "Active"
          },
          {
            id: "tm3",
            name: "Jason Lee",
            email: "jason@example.com",
            role: "Admin",
            dateAdded: "2023-04-10",
            photoUrl: "",
            status: "Active"
          }
        ];
        setAllClients(mockTeamMembers);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, []);
  
  // Add team member to a client
  const addTeamMember = useCallback(async (clientId: string, member: TeamMember) => {
    try {
      const { data, error } = await supabase
        .from('client_team_members')
        .insert({
          client_id: clientId,
          member_id: member.id,
          role: member.role
        })
        .select();
      
      if (error) throw error;
      
      toast.success(`Added ${member.name} to team`);
      return data;
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
      throw error;
    }
  }, []);
  
  // Remove team member from a client
  const removeTeamMember = useCallback(async (clientId: string, memberId: string) => {
    try {
      const { error } = await supabase
        .from('client_team_members')
        .delete()
        .eq('client_id', clientId)
        .eq('member_id', memberId);
      
      if (error) throw error;
      
      toast.success("Team member removed successfully");
      return true;
    } catch (error) {
      console.error("Error removing team member:", error);
      toast.error("Failed to remove team member");
      throw error;
    }
  }, []);
  
  // Get team members for a specific client
  const getClientTeam = useCallback(async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('client_team_members')
        .select(`
          *,
          member:member_id(*)
        `)
        .eq('client_id', clientId);
      
      if (error) throw error;
      
      // Map the response to TeamMember structure
      const teamMembers: TeamMember[] = (data || []).map((item: any) => ({
        id: item.member_id,
        name: item.member?.name || 'Unknown',
        email: item.member?.email || 'no-email@example.com',
        role: item.role || 'Member',
        dateAdded: item.created_at || new Date().toISOString(),
        photoUrl: item.member?.photo_url || '',
        status: item.member?.is_active ? 'Active' : 'Inactive'
      }));
      
      return teamMembers;
    } catch (error) {
      console.error("Error fetching client team:", error);
      // Return empty array in case of error
      return [];
    }
  }, []);
  
  return {
    allClients,
    isLoading,
    addTeamMember,
    removeTeamMember,
    getClientTeam
  };
}
