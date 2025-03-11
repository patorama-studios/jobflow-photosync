
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2, Users, DollarSign, CalendarDays, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { Company, useCompanies } from '@/hooks/use-companies';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useClients } from '@/hooks/use-clients';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { companies } = useCompanies();
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const { clients } = useClients();

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch company details
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          console.error('Error fetching company:', error);
          toast.error(`Failed to load company: ${error.message}`);
          return;
        }
        
        setCompany(data as Company);
        
        // Fetch company teams
        const { data: teamData, error: teamError } = await supabase
          .from('company_teams')
          .select('*')
          .eq('company_id', id);
          
        if (teamError) {
          console.error('Error fetching teams:', teamError);
        } else {
          setTeams(teamData || []);
          
          // If we have teams, fetch team members
          if (teamData && teamData.length > 0) {
            const teamIds = teamData.map(team => team.id);
            const { data: memberData, error: memberError } = await supabase
              .from('company_team_members')
              .select('*, clients(*)')
              .in('team_id', teamIds);
              
            if (memberError) {
              console.error('Error fetching team members:', memberError);
            } else {
              setTeamMembers(memberData || []);
            }
          }
        }
      } catch (err) {
        console.error('Error in company details:', err);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCompanyData();
  }, [id]);
  
  // If no ID is provided in the URL, find the company in the loaded companies
  useEffect(() => {
    if (!id || company) return;
    
    const foundCompany = companies.find(c => c.id === id);
    if (foundCompany) {
      setCompany(foundCompany);
      setIsLoading(false);
    }
  }, [id, companies, company]);

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="container py-8">
            <div className="flex items-center mb-6">
              <Button variant="ghost" onClick={goBack} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Skeleton className="h-8 w-64" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
            
            <div className="mt-8">
              <Skeleton className="h-10 w-96 mb-4" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

  if (!company) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="container py-8">
            <div className="flex items-center mb-6">
              <Button variant="ghost" onClick={goBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">Company not found</h1>
            </div>
            
            <p>The company you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={() => navigate('/customers')} className="mt-4">
              Go to Customers
            </Button>
          </div>
        </PageTransition>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageTransition>
        <div className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={goBack} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">{company.name}</h1>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">Edit</Button>
              <Button>Create Order</Button>
            </div>
          </div>
          
          {/* Company Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p className="text-xl font-medium capitalize">{company.industry}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                    <CalendarDays className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Jobs</p>
                    <p className="text-xl font-medium">{company.total_jobs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-xl font-medium">${company.total_revenue.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Open Jobs</p>
                    <p className="text-xl font-medium">{company.open_jobs}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Company Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Company Details</h2>
            <Card>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
                  <div className="space-y-3">
                    {company.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{company.email}</span>
                      </div>
                    )}
                    
                    {company.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{company.phone}</span>
                      </div>
                    )}
                    
                    {company.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>{company.website}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Address</h3>
                  {(company.address || company.city || company.state || company.zip) ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>
                          {company.address && <div>{company.address}</div>}
                          {(company.city || company.state || company.zip) && (
                            <div>
                              {company.city && `${company.city}, `}
                              {company.state && `${company.state} `}
                              {company.zip && company.zip}
                            </div>
                          )}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No address provided</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="teams">
            <TabsList>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="teams" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Company Teams</CardTitle>
                </CardHeader>
                <CardContent>
                  {teams.length === 0 ? (
                    <p className="text-muted-foreground">No teams found for this company.</p>
                  ) : (
                    teams.map(team => (
                      <div key={team.id} className="mb-6">
                        <h3 className="text-lg font-medium mb-2">{team.name}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {teamMembers
                            .filter(member => member.team_id === team.id)
                            .map(member => {
                              const client = member.clients;
                              return client ? (
                                <Card key={member.id} className="overflow-hidden">
                                  <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Users className="h-5 w-5" />
                                      </div>
                                      <div>
                                        <p className="font-medium">{client.name}</p>
                                        {client.email && <p className="text-xs text-muted-foreground">{client.email}</p>}
                                        {client.phone && <p className="text-xs text-muted-foreground">{client.phone}</p>}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ) : null;
                            })
                          }
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="jobs" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No recent jobs found.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Outstanding Balance</h3>
                      <p className="text-2xl font-bold">${company.outstanding_amount.toFixed(2)}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Total Revenue</h3>
                      <p className="text-2xl font-bold">${company.total_revenue.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </MainLayout>
  );
}
