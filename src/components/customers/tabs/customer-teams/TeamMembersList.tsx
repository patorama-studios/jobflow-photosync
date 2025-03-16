
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { TeamMember } from "@/components/customers/mock-data";

interface TeamMembersListProps {
  team: TeamMember[];
  searchQuery: string;
  removeTeamMember: (memberId: string) => void;
}

export function TeamMembersList({ 
  team, 
  searchQuery,
  removeTeamMember 
}: TeamMembersListProps) {
  const filteredTeam = team.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Leader</TableHead>
            <TableHead className="w-[250px]">Member</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-center">Admin Access</TableHead>
            <TableHead className="text-center">Finance Access</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTeam.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No team members found matching your search
              </TableCell>
            </TableRow>
          ) : (
            filteredTeam.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Checkbox 
                    checked={member.role === 'Leader'} 
                    disabled={member.role === 'Leader'}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.photoUrl} alt={member.name} />
                      <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">{member.email}</span>
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox 
                    checked={member.role === 'Admin' || member.role === 'Leader'} 
                    disabled={member.role === 'Leader'}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox 
                    checked={member.role === 'Finance' || member.role === 'Leader'} 
                    disabled={member.role === 'Leader'}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    disabled={member.role === 'Leader'}
                    onClick={() => removeTeamMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
