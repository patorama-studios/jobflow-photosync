
import React, { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Type definitions
type Role = "owner" | "admin" | "editor" | "photographer";

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: Role;
  status: "active" | "invited" | "inactive";
  lastActive?: string;
}

// Permission schema
interface PermissionSet {
  viewAllOrders: boolean;
  showOrderPricing: boolean;
  displayClientInfo: boolean;
  calendarAllEvents: boolean;
  manageProducts: boolean;
  accessReports: boolean;
  viewOrderNotes: boolean;
  managePayroll: boolean;
  createOrders: boolean;
  updateProductionStatus: boolean;
  sendNotifications: boolean;
}

// Mock data for demonstration
const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    avatarUrl: "",
    role: "owner",
    status: "active",
    lastActive: "2023-06-10T10:30:00",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    avatarUrl: "",
    role: "admin",
    status: "active",
    lastActive: "2023-06-09T14:45:00",
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    phone: "+1 (555) 456-7890",
    avatarUrl: "",
    role: "photographer",
    status: "active",
    lastActive: "2023-06-08T09:15:00",
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@example.com",
    phone: "+1 (555) 234-5678",
    avatarUrl: "",
    role: "editor",
    status: "invited",
    lastActive: undefined,
  },
];

// Default permissions for each role
const rolePermissions: Record<Role, PermissionSet> = {
  owner: {
    viewAllOrders: true,
    showOrderPricing: true,
    displayClientInfo: true,
    calendarAllEvents: true,
    manageProducts: true,
    accessReports: true,
    viewOrderNotes: true,
    managePayroll: true,
    createOrders: true,
    updateProductionStatus: true,
    sendNotifications: true,
  },
  admin: {
    viewAllOrders: true,
    showOrderPricing: true,
    displayClientInfo: true,
    calendarAllEvents: true,
    manageProducts: true,
    accessReports: true,
    viewOrderNotes: true,
    managePayroll: true,
    createOrders: true,
    updateProductionStatus: true,
    sendNotifications: true,
  },
  editor: {
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
  },
  photographer: {
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
  },
};

// User form schema
const userFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum(["owner", "admin", "editor", "photographer"]),
  avatarUrl: z.string().optional(),
});

// Function to get initials from name
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export function TeamSettings() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all-users");
  const [selectedUserPermissions, setSelectedUserPermissions] = useState<PermissionSet>(
    rolePermissions.photographer
  );
  const { toast } = useToast();

  // Form for adding/editing users
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "photographer",
      avatarUrl: "",
    },
  });

  const handleAddUser = (data: z.infer<typeof userFormSchema>) => {
    const newUser: TeamMember = {
      id: `${teamMembers.length + 1}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || "",
      role: data.role,
      avatarUrl: data.avatarUrl,
      status: "invited",
    };

    setTeamMembers([...teamMembers, newUser]);
    setIsAddUserDialogOpen(false);
    form.reset();

    toast({
      title: "User invitation sent",
      description: `An invitation has been sent to ${data.email}`,
    });
  };

  const handleEditUser = (data: z.infer<typeof userFormSchema>) => {
    if (!selectedMember) return;

    const updatedMembers = teamMembers.map((member) =>
      member.id === selectedMember.id
        ? {
            ...member,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone || "",
            role: data.role,
            avatarUrl: data.avatarUrl,
          }
        : member
    );

    setTeamMembers(updatedMembers);
    setIsEditUserDialogOpen(false);
    form.reset();

    toast({
      title: "User updated",
      description: `${data.firstName} ${data.lastName}'s profile has been updated`,
    });
  };

  const handleDeleteUser = (id: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== id));
    
    toast({
      title: "User removed",
      description: "The user has been removed from your team",
    });
  };

  const editUser = (member: TeamMember) => {
    setSelectedMember(member);
    form.reset({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      role: member.role,
      avatarUrl: member.avatarUrl,
    });
    setIsEditUserDialogOpen(true);
  };

  const openPermissionsDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setSelectedUserPermissions(rolePermissions[member.role]);
    setIsPermissionsDialogOpen(true);
  };

  const savePermissions = () => {
    // In a real app, this would save to a database
    toast({
      title: "Permissions updated",
      description: `Permissions for ${selectedMember?.firstName} ${selectedMember?.lastName} have been updated`,
    });
    setIsPermissionsDialogOpen(false);
  };

  // Filter users based on the active tab
  const filteredUsers = teamMembers.filter((member) => {
    if (activeTab === "all-users") return true;
    if (activeTab === "photographers") return member.role === "photographer";
    if (activeTab === "editors") return member.role === "editor";
    if (activeTab === "admins") return member.role === "admin" || member.role === "owner";
    return true;
  });

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
                      <AvatarImage src={member.avatarUrl} alt={`${member.firstName} ${member.lastName}`} />
                      <AvatarFallback>{getInitials(member.firstName, member.lastName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{`${member.firstName} ${member.lastName}`}</div>
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
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
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
                        <SelectItem value="photographer">Photographer</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
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
                      <AvatarImage src={selectedMember.avatarUrl} alt={`${selectedMember.firstName} ${selectedMember.lastName}`} />
                    ) : (
                      <AvatarFallback>
                        {selectedMember ? getInitials(selectedMember.firstName, selectedMember.lastName) : ""}
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
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
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
                        <SelectItem value="photographer">Photographer</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
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
              Permissions for {selectedMember?.firstName} {selectedMember?.lastName}
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
                onClick={() => setSelectedUserPermissions(rolePermissions[selectedMember?.role || "photographer"])}
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
