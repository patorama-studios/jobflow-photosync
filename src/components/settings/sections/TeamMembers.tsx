
import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Plus, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  avatar_url?: string;
  username?: string;
  updated_at?: string;
}

export function TeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    full_name: "",
    email: "",
    phone: "",
    role: "staff"
  });
  
  const roles = [
    { value: "admin", label: "Administrator" },
    { value: "manager", label: "Manager" },
    { value: "photographer", label: "Photographer" },
    { value: "editor", label: "Editor" },
    { value: "staff", label: "Staff" }
  ];

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');
      
      if (error) throw error;
      
      // Add default email if missing
      const enrichedData = data?.map(profile => ({
        ...profile,
        // Fix: Check for email in the profile and provide a fallback if it doesn't exist
        email: profile.email || `${profile.username || profile.id}@example.com`
      })) || [];
      
      setMembers(enrichedData as TeamMember[]);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to load team members");
    } finally {
      setIsLoading(false);
    }
  };

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
      role: "staff"
    });
    setIsDialogOpen(true);
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setMembers(members.filter(member => member.id !== id));
      toast.success("Team member removed successfully");
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to remove team member");
    }
  };

  const handleSaveMember = async () => {
    if (!newMember.full_name || !newMember.email || !newMember.role) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMember.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (editingMember) {
        // Update existing member
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: newMember.full_name,
            phone: newMember.phone,
            role: newMember.role,
            email: newMember.email // Add email to update
          })
          .eq('id', editingMember.id);
        
        if (error) throw error;
        
        setMembers(members.map(member => 
          member.id === editingMember.id 
            ? { ...member, ...newMember as TeamMember } 
            : member
        ));
        
        toast.success("Team member updated successfully");
      } else {
        // Create new team member
        // In a real application, you would use auth.signUp() to create a user
        // and then the trigger would create a profile
        
        // For this demo, we'll just create a placeholder profile
        const userId = crypto.randomUUID();
        
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: newMember.full_name,
            email: newMember.email,
            phone: newMember.phone,
            role: newMember.role
          });
        
        if (error) throw error;
        
        // Refresh the list to get the new member
        await fetchTeamMembers();
        
        toast.success("Team member added successfully");
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving team member:", error);
      toast.error("Failed to save team member");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'photographer':
        return 'bg-green-100 text-green-800';
      case 'editor':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getRoleLabel = (value: string) => {
    const role = roles.find(r => r.value === value);
    return role ? role.label : value.charAt(0).toUpperCase() + value.slice(1);
  };

  if (isLoading) {
    return <div>Loading team members...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Team Members</h3>
          <p className="text-sm text-muted-foreground">
            Manage users and their permissions
          </p>
        </div>
        <Button onClick={handleAddMember}>
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="text-center p-8 border rounded-md">
          <p className="text-muted-foreground mb-4">No team members found</p>
          <Button variant="outline" size="sm" onClick={handleAddMember}>
            Add Your First Team Member
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={member.avatar_url || ''} alt={member.full_name} />
                      <AvatarFallback>{getInitials(member.full_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.full_name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {member.email}
                    </div>
                    {member.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        {member.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(member.role)}`}>
                    {getRoleLabel(member.role)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEditMember(member)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
              />
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
              />
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
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMember} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (editingMember ? "Update Member" : "Add Member")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
