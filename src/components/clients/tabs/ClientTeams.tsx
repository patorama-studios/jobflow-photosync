
import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Customer } from "@/components/clients/mock-data";
import { useClientTeams } from "@/hooks/use-client-teams";
import { toast } from "sonner";
import { TeamManagementCard } from "./client-teams/TeamManagementCard";
import { TeamPermissionsCard } from "./client-teams/TeamPermissionsCard";
import { AddMemberDialog } from "./client-teams/AddMemberDialog";

interface ClientTeamsProps {
  client: Customer;
}

export function ClientTeams({ client }: ClientTeamsProps) {
  const [team, setTeam] = useState(client.team || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { allClients, isLoading: clientsLoading, addTeamMember, removeTeamMember, getClientTeam } = useClientTeams();
  
  // Function to load team members
  const loadTeamMembers = async () => {
    setIsLoading(true);
    try {
      const teamMembers = await getClientTeam(client.id);
      if (teamMembers.length > 0) {
        setTeam(teamMembers);
      } else if (client.team && client.team.length > 0) {
        // If no team members in DB yet but we have them in client object, use those
        setTeam(client.team);
        
        // Optionally, save these to the database for future fetches
        for (const member of client.team) {
          await addTeamMember(client.id, member);
        }
      }
    } catch (error) {
      console.error("Error loading team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load team members on component mount and whenever the client changes
  useEffect(() => {
    loadTeamMembers();
  }, [client.id]);
  
  // Add a team member
  const handleAddTeamMember = async (member) => {
    // Check if member already exists in team
    if (team.find(m => m.id === member.id)) {
      toast.info("This member is already in the team");
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await addTeamMember(client.id, member);
      if (result.success) {
        // Refresh the team list
        await loadTeamMembers();
        setShowAddDialog(false);
        toast.success(`Added ${member.name} to the team`);
      } else {
        toast.error(result.error?.message || "Failed to add team member");
      }
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Remove a team member
  const handleRemoveTeamMember = async (memberId) => {
    if (isLoading) return;
    
    // Don't allow removing the leader
    const memberToRemove = team.find(m => m.id === memberId);
    if (memberToRemove?.role === 'Leader') {
      toast.error("You cannot remove the team leader");
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await removeTeamMember(client.id, memberId);
      if (success) {
        // Refresh the team list to ensure UI is in sync with the database
        await loadTeamMembers();
        toast.success("Team member removed successfully");
      }
    } catch (error) {
      console.error("Error removing team member:", error);
      toast.error("Failed to remove team member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Dialog>
        <TeamManagementCard
          team={team}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isLoading={isLoading}
          showAddDialog={showAddDialog}
          setShowAddDialog={setShowAddDialog}
          removeTeamMember={handleRemoveTeamMember}
        />
        
        <AddMemberDialog
          isOpen={showAddDialog}
          onOpenChange={setShowAddDialog}
          potentialMembers={allClients}
          isLoading={clientsLoading}
          onAddMember={handleAddTeamMember}
        />
      </Dialog>
      
      <TeamPermissionsCard />
    </div>
  );
}
