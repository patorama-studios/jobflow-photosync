
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
      
      // Add default email if missing and convert to TeamMember type
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
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMember.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Creating new team member:", newMember);
      
      // Call the edge function to create a team member invitation
      const response = await fetch(`${window.location.origin}/api/send-invitation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newMember.email,
          role: newMember.role,
          fullName: newMember.full_name,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create team member');
      }
      
      // Add the new member to the local state with a temporary ID
      // In a real implementation, we'd fetch the actual ID from the profiles table
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
      
      // Update existing member
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
      
      // Update in local state
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
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
      toast.success("Team member removed successfully");
      return true;
    } catch (error: any) {
      console.error("Error deleting team member:", error);
      toast.error(error.message || "Failed to remove team member");
      return false;
    }
  }, []);

  // Load team members on mount
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
