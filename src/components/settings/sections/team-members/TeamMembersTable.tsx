
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash } from "lucide-react";
import { TeamMember, getInitials, getRoleBadgeClass, getRoleLabel } from "./types";

interface TeamMembersTableProps {
  members: TeamMember[];
  isLoading: boolean;
  searchQuery: string;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (id: string) => void;
  onAddMember: () => void;
}

export function TeamMembersTable({
  members,
  isLoading,
  searchQuery,
  onEditMember,
  onDeleteMember,
  onAddMember
}: TeamMembersTableProps) {
  const filteredMembers = members.filter(member => 
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (member.email && member.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
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
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              Loading team members...
            </TableCell>
          </TableRow>
        ) : filteredMembers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              No team members found matching your search
            </TableCell>
          </TableRow>
        ) : (
          filteredMembers.map((member) => (
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
                    <AvatarImage src={member.avatar_url || ''} alt={member.full_name} />
                    <AvatarFallback>{getInitials(member.full_name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{member.full_name}</span>
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
                  size="sm" 
                  onClick={() => onEditMember(member)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-destructive"
                  onClick={() => onDeleteMember(member.id)}
                  disabled={member.role === 'Leader'}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
