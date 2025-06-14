import { useState, useCallback, useEffect } from "react";
import { TeamMember } from "./types";
import { toast } from "sonner";
import { teamService } from "@/services/mysql/team-service";

export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔧 Fetching team members from MySQL');
      const teamMembers = await teamService.getTeamMembers();
      
      setMembers(teamMembers);
      console.log('🔧 Loaded team members:', teamMembers.length);
    } catch (error) {
      console.error("🔧 Error fetching team members:", error);
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
      console.log("🔧 Creating new team member:", newMember);
      
      const createdMember = await teamService.addTeamMember({
        full_name: newMember.full_name,
        email: newMember.email,
        phone: newMember.phone || '',
        role: newMember.role
      });
      
      if (createdMember) {
        setMembers(prev => [...prev, createdMember]);
        toast.success("Team member invited successfully! Invitation email sent.");
        return true;
      } else {
        throw new Error('Failed to create team member');
      }
    } catch (error: any) {
      console.error("🔧 Error saving team member:", error);
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
      console.log("🔧 Updating team member:", id, updatedMember);
      
      const updated = await teamService.updateTeamMember(id, updatedMember);
      
      if (updated) {
        setMembers(prevMembers => prevMembers.map(member => 
          member.id === id ? updated : member
        ));
        
        toast.success("Team member updated successfully");
        return true;
      } else {
        throw new Error('Failed to update team member');
      }
    } catch (error: any) {
      console.error("🔧 Error updating team member:", error);
      toast.error(error.message || "Failed to update team member");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const deleteTeamMember = useCallback(async (id: string) => {
    try {
      console.log("🔧 Attempting to delete team member with ID:", id);
      
      const success = await teamService.deleteTeamMember(id);
      
      if (success) {
        setMembers(prevMembers => prevMembers.filter(member => member.id !== id));
        toast.success("Team member deleted successfully");
        return true;
      } else {
        throw new Error('Failed to delete team member');
      }
    } catch (error: any) {
      console.error("🔧 Error deleting team member:", error);
      toast.error(error.message || "Failed to remove team member");
      return false;
    }
  }, []);

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
