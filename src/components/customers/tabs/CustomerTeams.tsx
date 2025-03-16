
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Customer, TeamMember } from "@/components/customers/mock-data";
import { TeamManagementCard } from "./customer-teams/TeamManagementCard";
import { AddMemberDialog } from "./customer-teams/AddMemberDialog";
import { TeamPermissionsCard } from "./customer-teams/TeamPermissionsCard";

interface CustomerTeamsProps {
  customer: Customer;
}

export function CustomerTeams({ customer }: CustomerTeamsProps) {
  const [team, setTeam] = useState<TeamMember[]>(customer.team || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Mock function to add a team member
  const addTeamMember = (member: TeamMember) => {
    setTeam([...team, member]);
    setShowAddDialog(false);
  };
  
  // Mock function to remove a team member
  const removeTeamMember = (memberId: string) => {
    setTeam(team.filter(member => member.id !== memberId));
  };
  
  // Mock data for potential team members to add
  const potentialMembers: TeamMember[] = [
    {
      id: '601',
      name: 'Jennifer Lee',
      email: 'jennifer@example.com',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      role: 'Admin'
    },
    {
      id: '602',
      name: 'Thomas Wright',
      email: 'thomas@example.com',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      role: 'Finance'
    }
  ];

  return (
    <div className="space-y-6">
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <TeamManagementCard
          team={team}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          removeTeamMember={removeTeamMember}
        />
        
        <AddMemberDialog
          isOpen={showAddDialog}
          onOpenChange={setShowAddDialog}
          potentialMembers={potentialMembers}
          onAddMember={addTeamMember}
        />
      </Dialog>
      
      <TeamPermissionsCard />
    </div>
  );
}
