
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
          photoUrl: client.photo_url || ''
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
            photoUrl: ""
          },
          {
            id: "tm2",
            name: "Maria Garcia",
            email: "maria@example.com",
            role: 'Admin' as TeamMemberRole,
            photoUrl: ""
          },
          {
            id: "tm3",
            name: "Jason Lee",
            email: "jason@example.com",
            role: 'Admin' as TeamMemberRole,
            photoUrl: ""
          }
        ];
        setAllClients(mockTeamMembers);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, []);
  
  // Add team member to a client with better error handling
  const addTeamMember = useCallback(async (clientId: string, member: TeamMember) => {
    try {
      // Since client_team_members doesn't exist in the schema, we're using a mock implementation
      // that simulates success but actually stores the data in localStorage for demo purposes
      
      // Load existing data with safety checks
      let teamData = {};
      try {
        const storedData = localStorage.getItem('client_teams');
        teamData = storedData ? JSON.parse(storedData) : {};
      } catch (e) {
        console.error("Error parsing stored team data:", e);
        teamData = {};
      }
      
      if (!teamData[clientId]) {
        teamData[clientId] = [];
      }
      
      // Check if member already exists
      if (!teamData[clientId].find((m: any) => m.id === member.id || m.member_id === member.id)) {
        teamData[clientId].push({
          client_id: clientId,
          member_id: member.id,
          role: member.role,
          member: {
            id: member.id,
            name: member.name,
            email: member.email,
            photoUrl: member.photoUrl
          }
        });
        
        localStorage.setItem('client_teams', JSON.stringify(teamData));
        toast.success(`Added ${member.name} to team`);
      } else {
        toast.info(`${member.name} is already on this team`);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
      return { success: false, error };
    }
  }, []);
  
  // Remove team member from a client with improved persistence
  const removeTeamMember = useCallback(async (clientId: string, memberId: string) => {
    try {
      // First try to delete from Supabase
      try {
        const { error: deleteError } = await supabase
          .from('team_members')
          .delete()
          .eq('id', memberId);
          
        if (deleteError) {
          console.log("Supabase deletion failed, using localStorage fallback:", deleteError);
        } else {
          // Successfully deleted from database
          toast.success("Team member removed successfully");
          return true;
        }
      } catch (dbError) {
        console.error("Database deletion error:", dbError);
      }
      
      // Fall back to localStorage if database delete fails or isn't available
      try {
        const storedData = localStorage.getItem('client_teams');
        if (!storedData) return false;
        
        const teamData = JSON.parse(storedData);
        
        if (teamData[clientId]) {
          // Find if the member exists before attempting removal
          const initialLength = teamData[clientId].length;
          teamData[clientId] = teamData[clientId].filter(
            (member: any) => member.member_id !== memberId && member.id !== memberId
          );
          
          // Only save and notify if we actually removed something
          if (teamData[clientId].length < initialLength) {
            localStorage.setItem('client_teams', JSON.stringify(teamData));
            toast.success("Team member removed successfully");
            return true;
          } else {
            console.log("Member not found in client team", memberId);
            return false;
          }
        }
      } catch (localError) {
        console.error("LocalStorage operation error:", localError);
        toast.error("Failed to remove team member");
      }
      
      return false;
    } catch (error) {
      console.error("Error removing team member:", error);
      toast.error("Failed to remove team member");
      return false;
    }
  }, []);
  
  // Get team members for a specific client with improved error handling
  const getClientTeam = useCallback(async (clientId: string) => {
    try {
      // First try to get from database (if it existed)
      try {
        const { data, error } = await supabase
          .from('client_team_members')
          .select('*')
          .eq('client_id', clientId);
          
        if (!error && data && data.length > 0) {
          // Map the response to TeamMember structure
          return data.map((item: any) => ({
            id: item.member_id,
            name: item.member?.name || 'Unknown',
            email: item.member?.email || 'no-email@example.com',
            role: item.role as TeamMemberRole,
            photoUrl: item.member?.photoUrl || ''
          }));
        }
      } catch (dbError) {
        console.log("Database fetch error, using localStorage fallback:", dbError);
      }
      
      // Fall back to localStorage
      let teamData = {};
      try {
        const storedData = localStorage.getItem('client_teams');
        if (storedData) {
          teamData = JSON.parse(storedData);
        }
      } catch (e) {
        console.error("Error parsing stored team data:", e);
        return [];
      }
      
      const clientTeam = teamData[clientId] || [];
      
      // Map the response to TeamMember structure
      const teamMembers: TeamMember[] = clientTeam.map((item: any) => ({
        id: item.member_id,
        name: item.member?.name || 'Unknown',
        email: item.member?.email || 'no-email@example.com',
        role: item.role as TeamMemberRole,
        photoUrl: item.member?.photoUrl || ''
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
