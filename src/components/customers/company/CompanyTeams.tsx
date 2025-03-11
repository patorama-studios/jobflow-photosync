
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, User } from 'lucide-react';
import { ClientSearch } from '@/components/calendar/appointment/components/ClientSearch';
import { AddClientDialog } from '@/components/calendar/appointment/components/AddClientDialog';
import { Client } from '@/hooks/use-clients';

interface TeamMember {
  id: string;
  name: string;
  email?: string;
}

interface CompanyTeamsProps {
  teamMembers: TeamMember[];
  onAddMember: (member: TeamMember) => void;
  onRemoveMember: (memberId: string) => void;
  onTeamNameChange: (name: string) => void;
  teamName: string;
}

export const CompanyTeams: React.FC<CompanyTeamsProps> = ({
  teamMembers,
  onAddMember,
  onRemoveMember,
  onTeamNameChange,
  teamName
}) => {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  const handleClientSelect = (client: Client) => {
    onAddMember({
      id: client.id,
      name: client.name,
      email: client.email
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium mb-2">Team Information</h3>
        <Input 
          placeholder="Team Name" 
          value={teamName} 
          onChange={(e) => onTeamNameChange(e.target.value)} 
        />
      </div>
      
      <div>
        <h3 className="text-base font-medium mb-2">Team Members</h3>
        <ClientSearch 
          onClientSelect={handleClientSelect}
          onAddNewClick={() => setIsAddClientOpen(true)}
        />
      </div>
      
      {teamMembers.length > 0 && (
        <div className="border rounded-md p-3">
          <h4 className="text-sm font-medium mb-2">Current Team Members</h4>
          <div className="space-y-2">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    {member.email && <p className="text-xs text-muted-foreground">{member.email}</p>}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRemoveMember(member.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {isAddClientOpen && (
        <AddClientDialog 
          open={isAddClientOpen} 
          onClose={() => setIsAddClientOpen(false)}
          onClientCreated={(client) => {
            handleClientSelect(client);
            setIsAddClientOpen(false);
          }}
        />
      )}
    </div>
  );
};
