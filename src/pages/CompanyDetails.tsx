
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowLeft, Building } from "lucide-react";
import { useCompanies, Company } from "@/hooks/use-companies";
import { useHeaderSettings } from "@/hooks/useHeaderSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

export default function CompanyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateSettings } = useHeaderSettings();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const { companies } = useCompanies();

  useEffect(() => {
    updateSettings({
      title: "Company Details",
      description: "Manage company information and related data"
    });
  }, [updateSettings]);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Find the company in the existing data
        const foundCompany = companies.find(c => c.id === id);
        
        if (foundCompany) {
          setCompany(foundCompany);
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id, companies]);

  if (loading) {
    return (
      <MainLayout>
        <PageTransition>
          <div className="container py-8">
            <div className="flex items-center mb-6">
              <Button variant="outline" size="sm" className="mr-4" onClick={() => navigate("/customers")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Skeleton className="h-8 w-64" />
            </div>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-32 w-full mb-6" />
                <Skeleton className="h-10 w-full mb-4" />
                <Skeleton className="h-80 w-full" />
              </CardContent>
            </Card>
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
              <Button variant="outline" size="sm" onClick={() => navigate("/customers")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Customers
              </Button>
            </div>
            <Card>
              <CardContent className="p-10 text-center">
                <h2 className="text-xl font-semibold mb-2">Company Not Found</h2>
                <p className="text-muted-foreground mb-6">The company you're looking for doesn't exist or you don't have permission to view it.</p>
                <Button onClick={() => navigate("/customers")}>Return to Customers</Button>
              </CardContent>
            </Card>
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
            <Button variant="outline" size="sm" onClick={() => navigate("/customers")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
            <Button size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit Company
            </Button>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{company.name}</h1>
                <p className="text-muted-foreground capitalize">{company.industry} company</p>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="overview">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="clients">Clients</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Company Information</h2>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p>{company.email || 'Not provided'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p>{company.phone || 'Not provided'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Website</p>
                          <p>{company.website || 'Not provided'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <div className="flex items-center mt-1">
                            <div className={`h-2 w-2 rounded-full mr-2 ${company.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <p className="capitalize">{company.status}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Address</h2>
                      
                      <div className="space-y-3">
                        {company.address ? (
                          <>
                            <p>{company.address}</p>
                            <p>
                              {company.city && `${company.city}, `}
                              {company.state && `${company.state} `}
                              {company.zip}
                            </p>
                          </>
                        ) : (
                          <p className="text-muted-foreground">No address provided</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <Card className="bg-muted/40">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-2">Total Jobs</h3>
                        <p className="text-3xl font-bold">{company.total_jobs || 0}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/40">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-2">Open Jobs</h3>
                        <p className="text-3xl font-bold">{company.open_jobs || 0}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/40">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-2">Total Revenue</h3>
                        <p className="text-3xl font-bold">${(company.total_revenue || 0).toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="clients">
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium mb-2">Clients Tab</h3>
                    <p className="text-muted-foreground">List of clients associated with this company will be displayed here.</p>
                  </div>
                </TabsContent>

                <TabsContent value="orders">
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium mb-2">Orders Tab</h3>
                    <p className="text-muted-foreground">Orders placed by this company will be displayed here.</p>
                  </div>
                </TabsContent>

                <TabsContent value="billing">
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium mb-2">Billing Tab</h3>
                    <p className="text-muted-foreground">Billing information and history will be displayed here.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </MainLayout>
  );
}
