import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "./types";
import { toast } from "sonner";

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');
      
      if (error) throw error;
      
      const enrichedData = data?.map((profile: any) => ({
        ...profile,
        email: profile.email || `${profile.username || profile.id}@example.com`,
        phone: profile.phone || ''
      })) || [];
      
      setMembers(enrichedData as TeamMember[]);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setError("Failed to load team members");
      toast.error("Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTeamMember = useCallback(async (newMember: Partial<TeamMember>) => {
    if (!newMember.full_name || !newMember.email || !newMember.role) {
      toast.error("Please fill in all required fields");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMember.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Creating new team member:", newMember);
      
      const response = await fetch(`${window.location.origin}/api/send-invitation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newMember.email,
          role: newMember.role,
          fullName: newMember.full_name,
          phone: newMember.phone || '',
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from edge function:", errorText);
        throw new Error(errorText || 'Failed to create team member');
      }
      
      let result;
      const responseText = await response.text();
      
      if (responseText && responseText.trim()) {
        try {
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError, "Raw response:", responseText);
          throw new Error('Invalid response from server');
        }
      } else {
        result = { success: true };
      }
      
      const tempId = crypto.randomUUID();
      
      const newTeamMember: TeamMember = {
        id: tempId,
        full_name: newMember.full_name,
        email: newMember.email,
        phone: newMember.phone || '',
        role: newMember.role,
        username: newMember.email.split('@')[0],
        updated_at: new Date().toISOString()
      };
      
      setMembers(prev => [...prev, newTeamMember]);
      toast.success("Team member invited successfully");
      return true;
    } catch (error: any) {
      console.error("Error saving team member:", error);
      toast.error(error.message || "Failed to save team member");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateTeamMember = useCallback(async (id: string, updatedMember: Partial<TeamMember>) => {
    if (!updatedMember.full_name || !updatedMember.role) {
      toast.error("Please fill in all required fields");
      return false;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Updating team member:", id, updatedMember);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updatedMember.full_name,
          phone: updatedMember.phone || null,
          role: updatedMember.role,
          username: updatedMember.username || updatedMember.email?.split('@')[0] || null
        })
        .eq('id', id);
      
      if (error) throw error;
      
      setMembers(prevMembers => prevMembers.map(member => 
        member.id === id 
          ? { ...member, ...updatedMember as TeamMember } 
          : member
      ));
      
      toast.success("Team member updated successfully");
      return true;
    } catch (error: any) {
      console.error("Error updating team member:", error);
      toast.error(error.message || "Failed to update team member");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deleteTeamMember = useCallback(async (id: string) => {
    try {
      console.log("Attempting to delete team member with ID:", id);
      
      const isTemporaryId = id.length === 36 && id.includes('-') && !id.startsWith('auth_');
      
      if (isTemporaryId) {
        console.log("Handling temporary ID deletion");
        // Remove from local state only for temporary IDs
        setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
        return true;
      }
      
      console.log("Deleting from Supabase profiles table");
      // For real DB IDs, first delete from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (profileError) {
        console.error("Error deleting from profiles:", profileError);
        throw profileError;
      }
      
      // Find related invitation to delete
      const memberToDelete = members.find(m => m.id === id);
      if (memberToDelete?.email) {
        console.log("Deleting related team invitations for email:", memberToDelete.email);
        const { error: inviteError } = await supabase
          .from('team_invitations')
          .delete()
          .eq('email', memberToDelete.email);
          
        if (inviteError) {
          console.warn("Could not delete related invitation:", inviteError);
        }
      }
      
      // Also check and delete from team_members table if exists
      const { error: teamMemberError } = await supabase
        .from('team_members')
        .delete()
        .eq('user_id', id);
      
      if (teamMemberError) {
        console.warn("Note: Could not delete from team_members:", teamMemberError);
        // Continue execution as this might not be a critical error
      }
      
      // Remove from local state after successful DB deletion
      setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
      return true;
    } catch (error: any) {
      console.error("Error deleting team member:", error);
      toast.error(error.message || "Failed to remove team member");
      return false;
    }
  }, [members]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  return {
    members,
    isLoading,
    isSubmitting,
    error,
    fetchTeamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    setMembers
  };
}
