
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";
import { TeamMember, getInitials, getRoleBadgeClass, getRoleLabel } from "./types";

interface TeamMembersTableProps {
  members: TeamMember[];
  isLoading: boolean;
  searchQuery: string;
  onEditMember: (member: TeamMember) => void;
  onDeleteMember: (id: string) => void;
  onAddMember: () => void;
  currentUserId?: string;
}

export function TeamMembersTable({
  members,
  isLoading,
  searchQuery,
  onEditMember,
  onDeleteMember,
  onAddMember,
  currentUserId
}: TeamMembersTableProps) {
  const filteredMembers = members.filter(member => 
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (member.email && member.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Member</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8">
              Loading team members...
            </TableCell>
          </TableRow>
        ) : filteredMembers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8">
              No team members found matching your search
            </TableCell>
          </TableRow>
        ) : (
          filteredMembers.map((member) => {
            const isCurrentUser = member.id === currentUserId;
            
            return (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar_url || ''} alt={member.full_name} />
                      <AvatarFallback>{getInitials(member.full_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">{member.full_name}</span>
                      {isCurrentUser && (
                        <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">{member.email}</span>
                </TableCell>
                <TableCell>
                  <Badge className={`${getRoleBadgeClass(member.role)} border`}>
                    {getRoleLabel(member.role)}
                  </Badge>
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
                    disabled={isCurrentUser && member.role === 'admin'}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
