
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Users, Calendar, UserCheck, FileCheck } from 'lucide-react';
import { generateDummyOrders } from '@/utils/generate-dummy-orders';
import { supabase } from '@/integrations/supabase/client';

const GenerateData = () => {
  const [isGeneratingOrders, setIsGeneratingOrders] = useState(false);
  const [isGeneratingUsers, setIsGeneratingUsers] = useState(false);
  const [orderCount, setOrderCount] = useState(10);
  const [userCount, setUserCount] = useState(5);
  
  const handleGenerateOrders = async () => {
    try {
      setIsGeneratingOrders(true);
      const data = await generateDummyOrders(orderCount);
      toast.success(`Successfully generated ${data.length} orders`);
    } catch (error: any) {
      console.error('Error generating orders:', error);
      toast.error(`Failed to generate orders: ${error.message}`);
    } finally {
      setIsGeneratingOrders(false);
    }
  };
  
  const handleGenerateUsers = async () => {
    try {
      setIsGeneratingUsers(true);
      
      const roles = ['admin', 'photographer', 'editor', 'customer'];
      const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Emma'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
      
      for (let i = 0; i < userCount; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const role = roles[Math.floor(Math.random() * roles.length)];
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@example.com`;
        
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .insert({
            full_name: `${firstName} ${lastName}`,
            username: `${firstName.toLowerCase()}${Math.floor(Math.random() * 100)}`,
            avatar_url: `https://i.pravatar.cc/150?u=${email}`,
            role: role
          })
          .select();
          
        if (userError) {
          console.error('Error creating user:', userError);
          continue;
        }
      }
      
      toast.success(`Generated ${userCount} users`);
    } catch (error: any) {
      console.error('Error generating users:', error);
      toast.error(`Failed to generate users: ${error.message}`);
    } finally {
      setIsGeneratingUsers(false);
    }
  };
  
  const handleClearOrders = async () => {
    if (!confirm('Are you sure you want to delete all orders? This cannot be undone.')) {
      return;
    }
    
    try {
      // First delete related records
      await supabase.from('order_products').delete().neq('id', 'none');
      
      // Then delete orders
      const { error } = await supabase
        .from('orders')
        .delete()
        .neq('id', 'none');
        
      if (error) throw error;
      
      toast.success('All orders have been deleted');
    } catch (error: any) {
      console.error('Error clearing orders:', error);
      toast.error(`Failed to clear orders: ${error.message}`);
    }
  };
  
  const handleClearUsers = async () => {
    if (!confirm('Are you sure you want to delete all users? This cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .neq('id', 'none');
        
      if (error) throw error;
      
      toast.success('All users have been deleted');
    } catch (error: any) {
      console.error('Error clearing users:', error);
      toast.error(`Failed to clear users: ${error.message}`);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Generate Sample Data</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Orders Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl">Generate Orders</CardTitle>
                <CardDescription>Create sample orders for testing</CardDescription>
              </div>
              <Calendar className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="orderCount">Number of Orders</Label>
                <Input 
                  id="orderCount" 
                  type="number" 
                  min="1" 
                  max="100" 
                  value={orderCount} 
                  onChange={(e) => setOrderCount(parseInt(e.target.value))} 
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleClearOrders}
                className="text-destructive hover:text-destructive"
              >
                Clear All Orders
              </Button>
              <Button 
                onClick={handleGenerateOrders} 
                disabled={isGeneratingOrders}
              >
                {isGeneratingOrders ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate Orders
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Users Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl">Generate Users</CardTitle>
                <CardDescription>Create sample users for testing</CardDescription>
              </div>
              <Users className="h-6 w-6 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="userCount">Number of Users</Label>
                <Input 
                  id="userCount" 
                  type="number" 
                  min="1" 
                  max="20" 
                  value={userCount} 
                  onChange={(e) => setUserCount(parseInt(e.target.value))} 
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleClearUsers}
                className="text-destructive hover:text-destructive"
              >
                Clear All Users
              </Button>
              <Button 
                onClick={handleGenerateUsers} 
                disabled={isGeneratingUsers}
              >
                {isGeneratingUsers ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Generate Users
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Data Management Guidelines</CardTitle>
              <CardDescription>Information about the generated data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">About Generated Orders</h3>
                <p className="text-muted-foreground">
                  Orders will be generated with random data, including client information, 
                  dates, times, and other details. The orders will span across past and future dates 
                  to simulate a real schedule.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">About Generated Users</h3>
                <p className="text-muted-foreground">
                  Users will be created with random names, emails, and assigned random roles (admin, 
                  photographer, editor, or customer). Each user will have a placeholder avatar image.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default GenerateData;
