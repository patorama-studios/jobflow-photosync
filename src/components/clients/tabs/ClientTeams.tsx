
import { useState, useEffect } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Customer, TeamMember } from "@/components/clients/mock-data";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useClientTeams } from "@/hooks/use-client-teams";
import { toast } from "sonner";

interface ClientTeamsProps {
  client: Customer;
}

export function ClientTeams({ client }: ClientTeamsProps) {
  const [team, setTeam] = useState<TeamMember[]>(client.team || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [potentialMemberSearch, setPotentialMemberSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { allClients, isLoading: clientsLoading, addTeamMember, removeTeamMember, getClientTeam } = useClientTeams();
  
  // Load team members on component mount
  useEffect(() => {
    const loadTeamMembers = async () => {
      setIsLoading(true);
      try {
        const teamMembers = await getClientTeam(client.id);
        if (teamMembers.length > 0) {
          setTeam(teamMembers);
        } else {
          // If no team members yet, ensure we at least have the client as leader
          if (client.team && client.team.length > 0) {
            setTeam(client.team);
          }
        }
      } catch (error) {
        console.error("Error loading team members:", error);
        toast.error("Failed to load team members");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTeamMembers();
  }, [client.id, client.team, getClientTeam]);
  
  // Filter potential members
  const filteredPotentialMembers = potentialMemberSearch.trim() === "" 
    ? allClients
    : allClients.filter(member => 
        member.name.toLowerCase().includes(potentialMemberSearch.toLowerCase()) ||
        member.email.toLowerCase().includes(potentialMemberSearch.toLowerCase())
      );
  
  // Add a team member
  const handleAddTeamMember = async (member: TeamMember) => {
    // Check if member already exists in team
    if (team.find(m => m.id === member.id)) {
      toast.info("This member is already in the team");
      return;
    }
    
    setIsLoading(true);
    try {
      await addTeamMember(client.id, member);
      setTeam([...team, member]);
      setShowAddDialog(false);
    } catch (error) {
      console.error("Error adding team member:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Remove a team member
  const handleRemoveTeamMember = async (memberId: string) => {
    if (isLoading) return;
    
    // Don't allow removing the leader
    const memberToRemove = team.find(m => m.id === memberId);
    if (memberToRemove?.role === 'Leader') {
      toast.error("You cannot remove the team leader");
      return;
    }
    
    setIsLoading(true);
    try {
      await removeTeamMember(client.id, memberId);
      setTeam(team.filter(member => member.id !== memberId));
    } catch (error) {
      console.error("Error removing team member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Team Management</CardTitle>
          <CardDescription>
            Manage team members who have access to this client's orders and billing information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10" 
                placeholder="Search team members..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </DialogTrigger>
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
                    {clientsLoading ? (
                      <div className="p-4 text-center text-muted-foreground">Loading clients...</div>
                    ) : filteredPotentialMembers.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">No matching clients found</div>
                    ) : (
                      filteredPotentialMembers.map((member) => (
                        <div 
                          key={member.id} 
                          className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                          onClick={() => handleAddTeamMember(member)}
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
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="overflow-x-auto">
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
                ) : team.filter(m => 
                  m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  m.email.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No team members found matching your search
                    </TableCell>
                  </TableRow>
                ) : (
                  team.filter(m => 
                    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    m.email.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((member) => (
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
                            <AvatarImage src={member.photoUrl} alt={member.name} />
                            <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
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
                          size="icon"
                          disabled={member.role === 'Leader' || isLoading}
                          onClick={() => handleRemoveTeamMember(member.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {team.length === 0 && !isLoading && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No team members found.</p>
              <Button className="mt-4" onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Team Permissions</CardTitle>
          <CardDescription>
            Control what actions team members can perform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-2">Team Leader</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• View and manage all orders</li>
                  <li>• Manage team members</li>
                  <li>• Access billing information</li>
                  <li>• Receive all notifications</li>
                </ul>
              </div>
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-2">Admin Role</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• View and manage orders</li>
                  <li>• Receive order notifications</li>
                  <li>• Cannot access billing</li>
                  <li>• Cannot manage team</li>
                </ul>
              </div>
              <div className="border rounded-md p-4">
                <h3 className="font-semibold mb-2">Finance Role</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• View order summaries</li>
                  <li>• Access billing information</li>
                  <li>• Receive invoice notifications</li>
                  <li>• Cannot manage team</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline">
                Customize Permissions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
