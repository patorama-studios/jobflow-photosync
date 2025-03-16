
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamMember } from "@/components/clients/mock-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  potentialMembers: TeamMember[];
  isLoading: boolean;
  onAddMember: (member: TeamMember) => void;
}

export function AddMemberDialog({
  isOpen,
  onOpenChange,
  potentialMembers,
  isLoading,
  onAddMember,
}: AddMemberDialogProps) {
  const [potentialMemberSearch, setPotentialMemberSearch] = useState("");

  const filteredPotentialMembers = potentialMemberSearch.trim() === "" 
    ? potentialMembers
    : potentialMembers.filter(member => 
        member.name.toLowerCase().includes(potentialMemberSearch.toLowerCase()) ||
        member.email.toLowerCase().includes(potentialMemberSearch.toLowerCase())
      );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Add an existing client to this team.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              className="pl-10" 
              placeholder="Search clients..."
              value={potentialMemberSearch}
              onChange={(e) => setPotentialMemberSearch(e.target.value)}
            />
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">Loading clients...</div>
            ) : filteredPotentialMembers.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No matching clients found</div>
            ) : (
              filteredPotentialMembers.map((member) => (
                <div 
                  key={member.id} 
                  className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                  onClick={() => onAddMember(member)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.photoUrl} alt={member.name} />
                      <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Add</Button>
                </div>
              ))
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
