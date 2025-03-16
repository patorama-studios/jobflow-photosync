
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeamMember, RoleOptions } from "./types";

interface TeamMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingMember: TeamMember | null;
  newMember: Partial<TeamMember>;
  setNewMember: (member: Partial<TeamMember>) => void;
  onSave: () => void;
  isSubmitting: boolean;
  isCurrentUser?: boolean;
}

export function TeamMemberDialog({
  isOpen,
  onOpenChange,
  editingMember,
  newMember,
  setNewMember,
  onSave,
  isSubmitting,
  isCurrentUser = false
}: TeamMemberDialogProps) {
  const title = editingMember ? "Edit Team Member" : "Add Team Member";
  const buttonText = editingMember ? "Save Changes" : "Add Team Member";
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMember({ ...newMember, [name]: value });
  };
  
  const handleRoleChange = (value: string) => {
    // Don't allow admin users to downgrade their own role
    if (isCurrentUser && editingMember?.role === 'admin' && value !== 'admin') {
      return;
    }
    
    setNewMember({ ...newMember, role: value });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="full_name">Name</Label>
            <Input
              id="full_name"
              name="full_name"
              placeholder="Full Name"
              value={newMember.full_name || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="Email Address"
              value={newMember.email || ''}
              onChange={handleInputChange}
              type="email"
              disabled={editingMember !== null} // Can't change email of existing member
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="Phone Number"
              value={newMember.phone || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select 
              value={newMember.role || 'photographer'} 
              onValueChange={handleRoleChange}
              disabled={isCurrentUser && editingMember?.role === 'admin'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {RoleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isCurrentUser && editingMember?.role === 'admin' && (
              <p className="text-xs text-amber-500 mt-1">You cannot downgrade your own admin privileges</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="submit"
            onClick={onSave}
            disabled={
              isSubmitting ||
              !newMember.full_name ||
              !newMember.email ||
              !newMember.role
            }
          >
            {isSubmitting ? "Saving..." : buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
