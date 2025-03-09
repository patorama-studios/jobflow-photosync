
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Customer, TeamMember } from '@/components/clients/mock-data';
import { toast } from 'sonner';

// Define valid role types to match TeamMember interface
type TeamMemberRole = 'Leader' | 'Admin' | 'Finance';

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
          role: 'Admin' as TeamMemberRole, // Set a valid role
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
            role: 'Admin' as TeamMemberRole,
            photoUrl: "",
            status: "Active"
          },
          {
            id: "tm2",
            name: "Maria Garcia",
            email: "maria@example.com",
            role: 'Admin' as TeamMemberRole,
            photoUrl: "",
            status: "Active"
          },
          {
            id: "tm3",
            name: "Jason Lee",
            email: "jason@example.com",
            role: 'Admin' as TeamMemberRole,
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
  
  // Add team member to a client - using a workaround for missing table
  const addTeamMember = useCallback(async (clientId: string, member: TeamMember) => {
    try {
      // Since client_team_members doesn't exist in the schema, we're using a mock implementation
      // that simulates success but actually stores the data in localStorage for demo purposes
      
      // In a real implementation, this would be a Supabase insert
      const teamData = JSON.parse(localStorage.getItem('client_teams') || '{}');
      if (!teamData[clientId]) {
        teamData[clientId] = [];
      }
      
      // Check if member already exists
      if (!teamData[clientId].find((m: any) => m.id === member.id)) {
        teamData[clientId].push({
          client_id: clientId,
          member_id: member.id,
          role: member.role,
          member: {
            id: member.id,
            name: member.name,
            email: member.email,
            photoUrl: member.photoUrl,
            status: member.status
          }
        });
        
        localStorage.setItem('client_teams', JSON.stringify(teamData));
      }
      
      toast.success(`Added ${member.name} to team`);
      return { success: true };
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
      throw error;
    }
  }, []);
  
  // Remove team member from a client
  const removeTeamMember = useCallback(async (clientId: string, memberId: string) => {
    try {
      // Since client_team_members doesn't exist in the schema, we're using a mock implementation
      // that simulates success but actually stores the data in localStorage for demo purposes
      
      const teamData = JSON.parse(localStorage.getItem('client_teams') || '{}');
      
      if (teamData[clientId]) {
        teamData[clientId] = teamData[clientId].filter((member: any) => member.member_id !== memberId);
        localStorage.setItem('client_teams', JSON.stringify(teamData));
      }
      
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
      // Since client_team_members doesn't exist in the schema, we're using a mock implementation
      // that retrieves data from localStorage for demo purposes
      
      const teamData = JSON.parse(localStorage.getItem('client_teams') || '{}');
      const clientTeam = teamData[clientId] || [];
      
      // Map the response to TeamMember structure
      const teamMembers: TeamMember[] = clientTeam.map((item: any) => ({
        id: item.member_id,
        name: item.member?.name || 'Unknown',
        email: item.member?.email || 'no-email@example.com',
        role: item.role as TeamMemberRole,
        photoUrl: item.member?.photoUrl || '',
        status: item.member?.status || 'Active'
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
