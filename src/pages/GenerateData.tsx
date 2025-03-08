
import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateDummyOrders } from "@/utils/generate-dummy-orders";
import { generateDummyUsers } from "@/utils/generate-dummy-users";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const GenerateData = () => {
  const [isGeneratingOrders, setIsGeneratingOrders] = useState(false);
  const [isGeneratingUsers, setIsGeneratingUsers] = useState(false);
  const [orderCount, setOrderCount] = useState(10);
  const [userCount, setUserCount] = useState(5);
  const [activeTab, setActiveTab] = useState("orders");

  const handleGenerateOrders = async () => {
    setIsGeneratingOrders(true);
    try {
      const orders = await generateDummyOrders(orderCount);
      toast.success(`Successfully generated ${orders.length} orders`);
    } catch (error: any) {
      toast.error(`Error generating orders: ${error.message}`);
      console.error(error);
    } finally {
      setIsGeneratingOrders(false);
    }
  };

  const handleGenerateUsers = async () => {
    setIsGeneratingUsers(true);
    try {
      const users = await generateDummyUsers(userCount);
      toast.success(`Successfully generated ${users.length} users`);
    } catch (error: any) {
      toast.error(`Error generating users: ${error.message}`);
      console.error(error);
    } finally {
      setIsGeneratingUsers(false);
    }
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Generate Dummy Data</h1>
            <p className="text-muted-foreground">
              Generate dummy data for testing purposes
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Orders</CardTitle>
                  <CardDescription>
                    Create sample orders for the application. This will create random orders with various statuses.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={orderCount}
                      onChange={(e) => setOrderCount(Number(e.target.value))}
                      className="w-24"
                    />
                    <span>orders to generate</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleGenerateOrders} 
                    disabled={isGeneratingOrders}
                  >
                    {isGeneratingOrders && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Orders
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Generate Users</CardTitle>
                  <CardDescription>
                    Create sample user accounts with various roles.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={userCount}
                      onChange={(e) => setUserCount(Number(e.target.value))}
                      className="w-24"
                    />
                    <span>users to generate</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleGenerateUsers} 
                    disabled={isGeneratingUsers}
                  >
                    {isGeneratingUsers && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Users
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default GenerateData;
