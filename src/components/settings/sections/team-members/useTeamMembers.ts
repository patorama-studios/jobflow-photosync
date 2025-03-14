
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "./types";
import { toast } from "sonner";
import { debounce } from "@/utils/performance-optimizer";

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
      
      // Generate a proper UUID using crypto API
      const memberId = crypto.randomUUID();
      
      // Create new team member
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: memberId,
          full_name: newMember.full_name,
          email: newMember.email,
          phone: newMember.phone || null,
          role: newMember.role,
          username: newMember.username || newMember.email.split('@')[0]
        })
        .select();
      
      if (error) throw error;
      
      console.log("Team member created:", data);
      
      // Update local state with the new member
      if (data && data[0]) {
        const newTeamMember: TeamMember = {
          id: data[0].id,
          full_name: data[0].full_name,
          email: newMember.email,
          phone: data[0].phone || '',
          role: data[0].role,
          username: data[0].username,
          avatar_url: data[0].avatar_url,
          updated_at: data[0].updated_at
        };
        setMembers(prev => [...prev, newTeamMember]);
      } else {
        // If no data returned, refresh the list
        await fetchTeamMembers();
      }
      
      toast.success("Team member added successfully");
      return true;
    } catch (error) {
      console.error("Error saving team member:", error);
      toast.error("Failed to save team member");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchTeamMembers]);

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
    } catch (error) {
      console.error("Error updating team member:", error);
      toast.error("Failed to update team member");
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
      
      if (error) {
        console.error("Supabase delete error:", error);
        throw error;
      }
      
      // Update local state only after successful deletion from database
      setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
      toast.success("Team member removed successfully");
      return true;
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to remove team member");
      return false;
    }
  }, []);

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
