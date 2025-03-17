
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { TeamMember } from "./team-members/types";
import { useTeamMembers } from "./team-members/useTeamMembers";
import { TeamMemberDialog } from "./team-members/TeamMemberDialog";
import { TeamMembersTable } from "./team-members/TeamMembersTable";
import { TeamRoleInfo } from "./team-members/TeamRoleInfo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function TeamMembers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    full_name: "",
    email: "",
    phone: "",
    role: "photographer" // Default role set to photographer
  });
  
  const { 
    members, 
    isLoading, 
    isSubmitting,
    fetchTeamMembers, 
    addTeamMember, 
    updateTeamMember, 
    deleteTeamMember 
  } = useTeamMembers();

  const { user, profile } = useAuth();

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers, user?.id]);

  useEffect(() => {
    if (profile && user && !isLoading && members.length > 0) {
      const currentUserExists = members.some(member => member.id === user.id);
      
      if (!currentUserExists && profile.role) {
        const currentUserProfile: TeamMember = {
          id: user.id,
          full_name: profile.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          phone: profile.phone || '',
          role: profile.role,
          username: profile.username,
          avatar_url: profile.avatar_url,
          updated_at: profile.updated_at
        };
        
        addTeamMember(currentUserProfile);
      }
    }
  }, [user, profile, members, isLoading, addTeamMember]);

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setNewMember({...member});
    setIsDialogOpen(true);
  };

  const handleAddMember = () => {
    setEditingMember(null);
    setNewMember({
      full_name: "",
      email: "",
      phone: "",
      role: "photographer" // Default role set to photographer
    });
    setIsDialogOpen(true);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (memberId === user?.id && profile?.role === 'admin') {
      toast.error("You cannot delete your own admin account");
      return;
    }
    
    try {
      const success = await deleteTeamMember(memberId);
      if (success) {
        toast.success("Team member removed successfully");
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
    }
  };

  const handleSaveMember = async () => {
    let success = false;
    
    if (editingMember) {
      if (editingMember.id === user?.id && editingMember.role === 'admin' && newMember.role !== 'admin') {
        toast.error("You cannot remove your own admin privileges");
        return;
      }
      
      success = await updateTeamMember(editingMember.id, newMember);
    } else {
      success = await addTeamMember(newMember);
    }
    
    if (success) {
      setIsDialogOpen(false);
      await fetchTeamMembers();
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage users and their permissions
              </CardDescription>
            </div>
            <Button onClick={handleAddMember}>
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {members.length === 0 && !isLoading ? (
            <div className="text-center p-8 border rounded-md">
              <p className="text-muted-foreground mb-4">No team members found</p>
              <Button variant="outline" size="sm" onClick={handleAddMember}>
                Add Your First Team Member
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <TeamMembersTable
                members={members}
                isLoading={isLoading}
                searchQuery={searchQuery}
                onEditMember={handleEditMember}
                onDeleteMember={handleDeleteMember}
                onAddMember={handleAddMember}
                currentUserId={user?.id}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <TeamRoleInfo />

      <TeamMemberDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingMember={editingMember}
        newMember={newMember}
        setNewMember={setNewMember}
        onSave={handleSaveMember}
        isSubmitting={isSubmitting}
        isCurrentUser={editingMember?.id === user?.id}
      />
    </div>
  );
}
