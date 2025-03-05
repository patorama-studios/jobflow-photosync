
import { useState } from "react";
import { ArrowLeft, Building, Users, Briefcase, Phone, Mail, MapPin, Globe, Twitter, Linkedin, Facebook } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { mockCompanies, mockCustomers } from "@/components/clients/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CompanyDetailsViewProps {
  companyId?: string;
}

export function CompanyDetailsView({ companyId }: CompanyDetailsViewProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  const company = companyId 
    ? mockCompanies.find(c => c.id === companyId) 
    : {
        id: 'new',
        name: '',
        industry: '',
        logoUrl: '',
        openJobs: 0,
        totalJobs: 0,
        outstandingAmount: 0,
        totalRevenue: 0
      };
  
  const form = useForm({
    defaultValues: {
      name: company?.name || '',
      industry: company?.industry || '',
      phone: '(555) 123-4567', // Mock data
      email: 'contact@company.com', // Mock data
      address: '123 Business St, City, State', // Mock data
      website: 'https://company.com', // Mock data
      twitter: '@company', // Mock data
      linkedin: 'company', // Mock data
      facebook: 'company', // Mock data
    }
  });

  // Find clients associated with this company
  const associatedClients = mockCustomers.filter(client => 
    client.company === company?.name
  );

  // Mock team members (would come from API in real application)
  const teamMembers = [
    {
      id: 't1',
      name: 'John Doe',
      email: 'john@company.com',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      role: 'Leader'
    },
    {
      id: 't2',
      name: 'Jane Smith',
      email: 'jane@company.com',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      role: 'Admin'
    },
    {
      id: 't3',
      name: 'Robert Johnson',
      email: 'robert@company.com',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
      role: 'Finance'
    }
  ];

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    // Here you would update the company data
    navigate("/companies");
  };

  if (!company) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold">Company not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/companies")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Companies
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/clients")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{company.id === 'new' ? 'New Company' : company.name}</h1>
            {company.id !== 'new' && (
              <p className="text-muted-foreground">{company.industry}</p>
            )}
          </div>
        </div>
        {company.id !== 'new' && (
          <div className="flex space-x-2">
            <Button variant="outline">
              <Briefcase className="mr-2 h-4 w-4" />
              Add Job
            </Button>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          {company.id !== 'new' && (
            <>
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Clients</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Team</span>
              </TabsTrigger>
            </>
          )}
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter company name" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter industry" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter phone number" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter email address" type="email" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter address" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter website URL" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Social Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twitter</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Twitter handle" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LinkedIn</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="LinkedIn profile" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Facebook page" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" type="button" onClick={() => navigate("/clients")}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {company.id === 'new' ? 'Create Company' : 'Update Company'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clients">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Associated Clients</CardTitle>
              <Button size="sm">
                <Users className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </CardHeader>
            <CardContent>
              {associatedClients.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Photo</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {associatedClients.map(client => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={client.photoUrl} alt={client.name} />
                            <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{client.name}</p>
                        </TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/clients/${client.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <Building className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No Clients Associated</h3>
                  <p className="text-muted-foreground">This company doesn't have any clients associated with it yet.</p>
                  <Button className="mt-4">
                    <Users className="h-4 w-4 mr-2" />
                    Add Client
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Team Members</CardTitle>
              <Button size="sm">
                <Users className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={member.photoUrl} alt={member.name} />
                          <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{member.name}</p>
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
