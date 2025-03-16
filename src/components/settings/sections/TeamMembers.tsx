
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

// This component includes full integration with Supabase to:
// - Fetch team members from the profiles table
// - Add new team members to the profiles table
// - Update existing team members in the profiles table
// - Delete team members from the profiles table
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

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

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

  const handleSaveMember = async () => {
    let success = false;
    
    if (editingMember) {
      success = await updateTeamMember(editingMember.id, newMember);
    } else {
      success = await addTeamMember(newMember);
    }
    
    if (success) {
      setIsDialogOpen(false);
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
                onDeleteMember={deleteTeamMember}
                onAddMember={handleAddMember}
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
      />
    </div>
  );
}
