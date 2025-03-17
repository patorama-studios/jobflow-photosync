
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
      console.log("Adding team member:", clientId, member);
      
      // Check if member already exists in team
      const { data: existingMembers, error: checkError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', clientId)
        .eq('email', member.email);
      
      if (checkError) {
        console.error("Error checking for existing team member:", checkError);
        throw checkError;
      }
      
      if (existingMembers && existingMembers.length > 0) {
        console.log("Member already exists in team:", existingMembers);
        return { success: false, error: { message: "This member is already in the team" } };
      }
      
      // Insert the team member into the team_members table
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          team_id: clientId,
          name: member.name,
          email: member.email,
          role: member.role
        })
        .select();
      
      if (error) {
        console.error("Error inserting team member:", error);
        return { success: false, error };
      }
      
      console.log("Team member added successfully:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Error adding team member:", error);
      return { success: false, error };
    }
  }, []);
  
  // Remove team member from a client with improved persistence
  const removeTeamMember = useCallback(async (clientId: string, memberId: string) => {
    try {
      console.log("Removing team member:", clientId, memberId);
      
      // Check if this is a temporary ID (client-side generated, starts with "tm")
      if (memberId.startsWith("tm")) {
        // Just return success for temporary IDs
        console.log("Temporary ID detected, no database operation needed");
        return true;
      }
      
      // Try to delete the team member from the database
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId)
        .eq('team_id', clientId);
      
      if (error) {
        console.error("Error deleting team member:", error);
        throw error;
      }
      
      console.log("Team member removed successfully from database");
      return true;
    } catch (error) {
      console.error("Error removing team member:", error);
      toast.error("Database error: Failed to remove team member");
      return false;
    }
  }, []);
  
  // Get team members for a specific client with improved error handling
  const getClientTeam = useCallback(async (clientId: string) => {
    try {
      console.log("Fetching team for client:", clientId);
      
      // Get team members from the team_members table
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', clientId);
      
      if (error) {
        console.error("Error fetching team members:", error);
        throw error;
      }
      
      console.log("Team members fetched:", data);
      
      // Map the response to TeamMember structure
      const teamMembers: TeamMember[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name || 'Unknown',
        email: item.email || 'no-email@example.com',
        role: item.role as TeamMemberRole,
        photoUrl: item.photo_url || ''
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
