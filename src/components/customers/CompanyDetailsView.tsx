
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanies } from '@/hooks/use-companies';
import { useClients } from '@/hooks/use-clients';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Building, Edit2, Trash2, Users, Briefcase, DollarSign } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CompanyDetailsViewProps {
  companyId: string;
}

export function CompanyDetailsView({ companyId }: CompanyDetailsViewProps) {
  const navigate = useNavigate();
  const { getCompanyById, isLoading: isCompanyLoading } = useCompanies();
  const { clients, isLoading: isClientsLoading } = useClients();
  const [company, setCompany] = useState<any | null>(null);
  const [companyClients, setCompanyClients] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCompany, setEditedCompany] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const companyData = await getCompanyById(companyId);
        if (companyData) {
          setCompany(companyData);
          setEditedCompany(companyData);
        } else {
          toast.error('Company not found');
          navigate('/customers');
        }
      } catch (error) {
        console.error('Error loading company:', error);
        toast.error('Failed to load company data');
      }
    };

    loadCompanyData();
  }, [companyId, getCompanyById, navigate]);

  useEffect(() => {
    if (clients && company) {
      const filtered = clients.filter(client => client.company_id === companyId);
      setCompanyClients(filtered);
    }
  }, [clients, company, companyId]);

  const filteredClients = searchQuery 
    ? companyClients.filter(client => 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        client.email.toLowerCase().includes(searchQuery.toLowerCase()))
    : companyClients;

  const handleBackClick = () => {
    navigate('/customers');
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedCompany(company);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCompany(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveCompany = async () => {
    try {
      if (!editedCompany) return;

      const { error } = await supabase
        .from('companies')
        .update({
          name: editedCompany.name,
          email: editedCompany.email,
          phone: editedCompany.phone,
          industry: editedCompany.industry,
          website: editedCompany.website,
          address: editedCompany.address,
          city: editedCompany.city,
          state: editedCompany.state,
          zip: editedCompany.zip
        })
        .eq('id', companyId);

      if (error) throw error;

      setCompany(editedCompany);
      setIsEditing(false);
      toast.success('Company updated successfully');
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Failed to update company');
    }
  };

  if (isCompanyLoading || !company) {
    return (
      <div className="container">
        <div className="py-6">
          <div className="h-8 w-40 bg-gray-200 animate-pulse rounded"></div>
          <div className="mt-4 h-12 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleBackClick}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <p className="text-muted-foreground">{company.industry}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleEditClick}>
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveCompany}>
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-4 w-full sm:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name</label>
                    <Input 
                      name="name" 
                      value={editedCompany.name || ''} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Industry</label>
                    <Input 
                      name="industry" 
                      value={editedCompany.industry || ''} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website</label>
                    <Input 
                      name="website" 
                      value={editedCompany.website || ''} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      name="email" 
                      value={editedCompany.email || ''} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input 
                      name="phone" 
                      value={editedCompany.phone || ''} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input 
                      name="address" 
                      value={editedCompany.address || ''} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Input 
                        name="city" 
                        value={editedCompany.city || ''} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">State</label>
                      <Input 
                        name="state" 
                        value={editedCompany.state || ''} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ZIP</label>
                      <Input 
                        name="zip" 
                        value={editedCompany.zip || ''} 
                        onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2 text-primary" />
                    Company Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Industry</dt>
                      <dd>{company.industry || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Website</dt>
                      <dd>
                        {company.website ? (
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {company.website}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                      <dd>
                        {company.email ? (
                          <a href={`mailto:${company.email}`} className="text-primary hover:underline">
                            {company.email}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Phone</dt>
                      <dd>
                        {company.phone ? (
                          <a href={`tel:${company.phone}`} className="text-primary hover:underline">
                            {company.phone}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Total Clients</dt>
                      <dd className="text-2xl font-bold">{companyClients.length}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Active Clients</dt>
                      <dd>
                        {companyClients.filter(client => client.status === 'active').length}
                      </dd>
                    </div>
                    {companyClients.length > 0 && (
                      <div className="pt-2">
                        <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(`/clients?company=${companyId}`)}>
                          View All Clients
                        </Button>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-primary" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Total Orders</dt>
                      <dd className="text-2xl font-bold">{company.total_jobs || 0}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Open Orders</dt>
                      <dd>{company.open_jobs || 0}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Total Revenue</dt>
                      <dd className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2
                        }).format(company.total_revenue || 0)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Outstanding</dt>
                      <dd className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-amber-500" />
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2
                        }).format(company.outstanding_amount || 0)}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle>Address Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <address className="not-italic">
                    {company.address && <div>{company.address}</div>}
                    {(company.city || company.state || company.zip) && (
                      <div>
                        {company.city && <span>{company.city}</span>}
                        {company.state && <span>, {company.state}</span>}
                        {company.zip && <span> {company.zip}</span>}
                      </div>
                    )}
                  </address>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="clients" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Clients</CardTitle>
                <Input 
                  placeholder="Search clients..." 
                  className="w-[250px]" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {isClientsLoading ? (
                <div className="flex items-center justify-center h-40">
                  <p>Loading clients...</p>
                </div>
              ) : filteredClients.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No clients found for this company</p>
                  <Button className="mt-4" onClick={() => navigate('/customers/add')}>
                    Add New Client
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{client.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone || 'N/A'}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            client.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {client.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate(`/clients/${client.id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                All orders associated with this company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">Order data is currently being loaded</p>
                <Button className="mt-4" onClick={() => navigate('/orders')}>
                  View All Orders
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Financial information and payment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Summary</h3>
                    <Separator className="my-2" />
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Total Revenue</dt>
                        <dd className="font-medium">${company.total_revenue || 0}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Outstanding Amount</dt>
                        <dd className="font-medium">${company.outstanding_amount || 0}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Recent Payments</h3>
                  <Separator className="my-2" />
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No payment history available</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
