
import { useState } from "react";
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

interface ClientTeamsProps {
  client: Customer;
}

export function ClientTeams({ client }: ClientTeamsProps) {
  const [team, setTeam] = useState<TeamMember[]>(client.team || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Mock function to add a team member
  const addTeamMember = (member: TeamMember) => {
    setTeam([...team, member]);
    setShowAddDialog(false);
  };
  
  // Mock function to remove a team member
  const removeTeamMember = (memberId: string) => {
    setTeam(team.filter(member => member.id !== memberId));
  };
  
  // Mock data for potential team members to add
  const potentialMembers: TeamMember[] = [
    {
      id: '601',
      name: 'Jennifer Lee',
      email: 'jennifer@example.com',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
      role: 'Admin'
    },
    {
      id: '602',
      name: 'Thomas Wright',
      email: 'thomas@example.com',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      role: 'Finance'
    }
  ];

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
                    <Input className="pl-10" placeholder="Search clients..." />
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {potentialMembers.map((member) => (
                      <div 
                        key={member.id} 
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => addTeamMember(member)}
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
                    ))}
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
                {team.filter(m => 
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
                        disabled={member.role === 'Leader'}
                        onClick={() => removeTeamMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {team.length === 0 && (
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
