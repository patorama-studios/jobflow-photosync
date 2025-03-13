
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TeamMember, RoleOptions } from "./types";
import { Loader2 } from "lucide-react";

interface TeamMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingMember: TeamMember | null;
  newMember: Partial<TeamMember>;
  setNewMember: React.Dispatch<React.SetStateAction<Partial<TeamMember>>>;
  onSave: () => void;
  isSubmitting: boolean;
}

export function TeamMemberDialog({
  isOpen,
  onOpenChange,
  editingMember,
  newMember,
  setNewMember,
  onSave,
  isSubmitting
}: TeamMemberDialogProps) {
  const [errors, setErrors] = useState<{
    full_name?: string;
    email?: string;
    role?: string;
  }>({});

  const validate = () => {
    const newErrors: {
      full_name?: string;
      email?: string;
      role?: string;
    } = {};
    
    if (!newMember.full_name || newMember.full_name.trim() === '') {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!newMember.email || newMember.email.trim() === '') {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newMember.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!newMember.role) {
      newErrors.role = 'Role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      onSave();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingMember ? "Edit Team Member" : "Add Team Member"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={newMember.full_name || ''}
              onChange={(e) => setNewMember({...newMember, full_name: e.target.value})}
              placeholder="John Doe"
              className={errors.full_name ? "border-red-500" : ""}
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm">{errors.full_name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newMember.email || ''}
              onChange={(e) => setNewMember({...newMember, email: e.target.value})}
              placeholder="john@example.com"
              disabled={!!editingMember} // Can't change email of existing member
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              value={newMember.phone || ''}
              onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
              placeholder="(555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={newMember.role}
              onValueChange={(value) => setNewMember({...newMember, role: value})}
            >
              <SelectTrigger id="role" className={errors.role ? "border-red-500" : ""}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {RoleOptions.map(role => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              editingMember ? "Update Member" : "Add Member"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
