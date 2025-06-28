
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Mail, 
  Camera, 
  Check, 
  X, 
  UserPlus, 
  ShieldCheck, 
  Settings2, 
  AlertTriangle 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamManagementService, TeamMember, PermissionSet } from '@/services/mysql/team-management-service';
import { useAuth } from '@/contexts/MySQLAuthContext';

// Type definitions for form
type Role = "owner" | "admin" | "Team Leader" | "Admin Staff" | "Agent" | "photographer" | "editor" | "Property Management";

// Get available roles from service
const availableRoles = teamManagementService.getAvailableRoles();

// User form schema
const userFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum(["owner", "admin", "Team Leader", "Admin Staff", "Agent", "photographer", "editor", "Property Management"]),
  job_title: z.string().optional(),
});

// Function to get initials from full name
const getInitials = (fullName: string) => {
  if (!fullName) return "";
  const names = fullName.split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
};

export function TeamSettings() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all-users");
  const [selectedUserPermissions, setSelectedUserPermissions] = useState<PermissionSet>({
    viewAllOrders: false,
    showOrderPricing: false,
    displayClientInfo: true,
    calendarAllEvents: false,
    manageProducts: false,
    accessReports: false,
    viewOrderNotes: true,
    managePayroll: false,
    createOrders: false,
    updateProductionStatus: true,
    sendNotifications: false,
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Form for adding/editing users
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      role: "Agent",
      job_title: "",
    },
  });

  // Load team members on component mount
  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const members = await teamManagementService.getTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      console.error('Error loading team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (data: z.infer<typeof userFormSchema>) => {
    try {
      if (!user) {
        toast.error('You must be logged in to add team members');
        return;
      }

      // For now, we'll use a default company_id - in a real app, this would come from the user's context
      const newUserData = {
        company_id: 'default-company-id', // TODO: Get from user context
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || "",
        role: data.role,
        job_title: data.job_title || "",
        status: "pending" as const,
      };

      const newUser = await teamManagementService.addTeamMember(newUserData);
      
      if (newUser) {
        await loadTeamMembers(); // Refresh the list
        setIsAddUserDialogOpen(false);
        form.reset();
        
        // Send invitation email
        await teamManagementService.sendInvitation(data.email, data.role, 'Your Company');
        toast.success(`User invitation sent - An invitation has been sent to ${data.email}`);
      } else {
        toast.error('Failed to add team member');
      }
    } catch (error) {
      console.error('Error adding team member:', error);
      toast.error('Failed to add team member');
    }
  };

  const handleEditUser = async (data: z.infer<typeof userFormSchema>) => {
    if (!selectedMember) return;

    try {
      const updateData = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || "",
        role: data.role,
        job_title: data.job_title || "",
      };

      const updatedMember = await teamManagementService.updateTeamMember(selectedMember.id, updateData);
      
      if (updatedMember) {
        await loadTeamMembers(); // Refresh the list
        setIsEditUserDialogOpen(false);
        form.reset();
        toast.success(`User updated - ${data.full_name}'s profile has been updated`);
      } else {
        toast.error('Failed to update team member');
      }
    } catch (error) {
      console.error('Error updating team member:', error);
      toast.error('Failed to update team member');
    }
  };

  const handleDeleteUser = async (id: string | number) => {
    try {
      const success = await teamManagementService.deleteTeamMember(id);
      
      if (success) {
        await loadTeamMembers(); // Refresh the list
        toast.success("User removed - The user has been removed from your team");
      } else {
        toast.error('Failed to remove team member');
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to remove team member');
    }
  };

  const editUser = (member: TeamMember) => {
    setSelectedMember(member);
    form.reset({
      full_name: member.full_name,
      email: member.email,
      phone: member.phone || "",
      role: member.role,
      job_title: member.job_title || "",
    });
    setIsEditUserDialogOpen(true);
  };

  const openPermissionsDialog = async (member: TeamMember) => {
    setSelectedMember(member);
    
    // Load permissions from database
    const permissions = await teamManagementService.getTeamMemberPermissions(member.id);
    if (permissions) {
      setSelectedUserPermissions(permissions);
    }
    
    setIsPermissionsDialogOpen(true);
  };

  const savePermissions = async () => {
    if (!selectedMember) return;
    
    try {
      const success = await teamManagementService.saveTeamMemberPermissions(selectedMember.id, selectedUserPermissions);
      
      if (success) {
        toast.success(`Permissions updated - Permissions for ${selectedMember.full_name} have been updated`);
        setIsPermissionsDialogOpen(false);
      } else {
        toast.error('Failed to save permissions');
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Failed to save permissions');
    }
  };

  // Filter users based on the active tab
  const filteredUsers = teamMembers.filter((member) => {
    if (activeTab === "all-users") return true;
    if (activeTab === "photographers") return member.role === "photographer";
    if (activeTab === "editors") return member.role === "editor";
    if (activeTab === "admins") return member.role === "admin" || member.role === "owner";
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-4 mx-auto"></div>
          <p>Loading team members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">My Team</h2>
        <p className="text-muted-foreground">
          Manage team members, roles, and permissions
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList>
            <TabsTrigger value="all-users">All Users</TabsTrigger>
            <TabsTrigger value="photographers">Photographers</TabsTrigger>
            <TabsTrigger value="editors">Editors</TabsTrigger>
            <TabsTrigger value="admins">Admins</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button onClick={() => {
          form.reset();
          setIsAddUserDialogOpen(true);
        }}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatarUrl} alt={member.full_name} />
                      <AvatarFallback>{getInitials(member.full_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.full_name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary-foreground text-primary-foreground bg-opacity-10">
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  {member.status === "active" ? (
                    <span className="inline-flex items-center text-green-700">
                      <Check className="mr-1 h-4 w-4" />
                      Active
                    </span>
                  ) : member.status === "invited" ? (
                    <span className="inline-flex items-center text-amber-700">
                      <Mail className="mr-1 h-4 w-4" />
                      Invited
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-red-700">
                      <X className="mr-1 h-4 w-4" />
                      Inactive
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {member.lastActive ? new Date(member.lastActive).toLocaleDateString() : "Never"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openPermissionsDialog(member)}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span className="sr-only">Permissions</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editUser(member)}
                    >
                      <Edit2 className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    {member.role !== "owner" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(member.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to your team. They will receive an email invitation.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddUser)} className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl">+</AvatarFallback>
                  </Avatar>
                  <Button 
                    type="button"
                    size="sm" 
                    className="absolute bottom-0 right-0 rounded-full p-2" 
                    variant="secondary"
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Upload photo</span>
                  </Button>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="job_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Senior Photographer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This will determine their default permissions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Send Invitation</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update information for this team member.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditUser)} className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    {selectedMember?.avatarUrl ? (
                      <AvatarImage src={selectedMember.avatarUrl} alt={selectedMember.full_name} />
                    ) : (
                      <AvatarFallback>
                        {selectedMember ? getInitials(selectedMember.full_name) : ""}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button 
                    type="button"
                    size="sm" 
                    className="absolute bottom-0 right-0 rounded-full p-2" 
                    variant="secondary"
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Update photo</span>
                  </Button>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="job_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This will affect their system permissions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ShieldCheck className="mr-2 h-5 w-5" />
              Permissions for {selectedMember?.full_name}
            </DialogTitle>
            <DialogDescription>
              Customize what this team member can access and modify.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">General Permissions</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={async () => {
                  if (selectedMember) {
                    const defaultPermissions = await teamManagementService.getTeamMemberPermissions(selectedMember.id);
                    if (defaultPermissions) {
                      setSelectedUserPermissions(defaultPermissions);
                    }
                  }
                }}
              >
                Reset to Role Defaults
              </Button>
            </div>
            
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="viewAllOrders" className="flex flex-col">
                  <span>View All Orders</span>
                  <span className="text-xs text-muted-foreground">See all orders in the system</span>
                </Label>
                <Switch 
                  id="viewAllOrders" 
                  checked={selectedUserPermissions.viewAllOrders}
                  onCheckedChange={(checked) => 
                    setSelectedUserPermissions({...selectedUserPermissions, viewAllOrders: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="showOrderPricing" className="flex flex-col">
                  <span>Show Order Pricing</span>
                  <span className="text-xs text-muted-foreground">See financial details of orders</span>
                </Label>
                <Switch 
                  id="showOrderPricing" 
                  checked={selectedUserPermissions.showOrderPricing}
                  onCheckedChange={(checked) => 
                    setSelectedUserPermissions({...selectedUserPermissions, showOrderPricing: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="displayClientInfo" className="flex flex-col">
                  <span>Display Client Information</span>
                  <span className="text-xs text-muted-foreground">See client contact details</span>
                </Label>
                <Switch 
                  id="displayClientInfo" 
                  checked={selectedUserPermissions.displayClientInfo}
                  onCheckedChange={(checked) => 
                    setSelectedUserPermissions({...selectedUserPermissions, displayClientInfo: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="calendarAllEvents" className="flex flex-col">
                  <span>View All Calendar Events</span>
                  <span className="text-xs text-muted-foreground">See all calendar events vs. only assigned ones</span>
                </Label>
                <Switch 
                  id="calendarAllEvents" 
                  checked={selectedUserPermissions.calendarAllEvents}
                  onCheckedChange={(checked) => 
                    setSelectedUserPermissions({...selectedUserPermissions, calendarAllEvents: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="manageProducts" className="flex flex-col">
                  <span>Manage Products and Pricing</span>
                  <span className="text-xs text-muted-foreground">Add/edit products and set prices</span>
                </Label>
                <Switch 
                  id="manageProducts" 
                  checked={selectedUserPermissions.manageProducts}
                  onCheckedChange={(checked) => 
                    setSelectedUserPermissions({...selectedUserPermissions, manageProducts: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="accessReports" className="flex flex-col">
                  <span>Access Reports</span>
                  <span className="text-xs text-muted-foreground">View business analytics and reports</span>
                </Label>
                <Switch 
                  id="accessReports" 
                  checked={selectedUserPermissions.accessReports}
                  onCheckedChange={(checked) => 
                    setSelectedUserPermissions({...selectedUserPermissions, accessReports: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="viewOrderNotes" className="flex flex-col">
                  <span>View Order Activity Notes</span>
                  <span className="text-xs text-muted-foreground">See comments and notes on orders</span>
                </Label>
                <Switch 
                  id="viewOrderNotes" 
                  checked={selectedUserPermissions.viewOrderNotes}
                  onCheckedChange={(checked) => 
                    setSelectedUserPermissions({...selectedUserPermissions, viewOrderNotes: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="managePayroll" className="flex flex-col">
                  <span>Manage Payroll</span>
                  <span className="text-xs text-muted-foreground">View/edit payroll for team members</span>
                </Label>
                <Switch 
                  id="managePayroll" 
                  checked={selectedUserPermissions.managePayroll}
                  onCheckedChange={(checked) => 
                    setSelectedUserPermissions({...selectedUserPermissions, managePayroll: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="createOrders" className="flex flex-col">
                  <span>Create Orders and Events</span>
                  <span className="text-xs text-muted-foreground">Add new orders and calendar events</span>
                </Label>
                <Switch 
                  id="createOrders" 
                  checked={selectedUserPermissions.createOrders}
                  onCheckedChange={(checked) => 
                    setSelectedUserPermissions({...selectedUserPermissions, createOrders: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="updateProductionStatus" className="flex flex-col">
                  <span>Update Production Status</span>
                  <span className="text-xs text-muted-foreground">Change job status on production board</span>
                </Label>
                <Switch 
                  id="updateProductionStatus" 
                  checked={selectedUserPermissions.updateProductionStatus}
                  onCheckedChange={(checked) => 
                    setSelectedUserPermissions({...selectedUserPermissions, updateProductionStatus: checked})
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="sendNotifications" className="flex flex-col">
                  <span>Send Notifications</span>
                  <span className="text-xs text-muted-foreground">Send emails and notifications to clients/team</span>
                </Label>
                <Switch 
                  id="sendNotifications" 
                  checked={selectedUserPermissions.sendNotifications}
                  onCheckedChange={(checked) => 
                    setSelectedUserPermissions({...selectedUserPermissions, sendNotifications: checked})
                  }
                />
              </div>
            </div>
            
            <div className="pt-4 flex items-center text-amber-600 gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                Some permissions may override others. Review carefully before saving.
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPermissionsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePermissions}>
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TeamSettings;
