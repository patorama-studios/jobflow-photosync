
import React, { useEffect, useState } from 'react';
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { AuthHeader } from './AuthHeader';
import { toast } from 'sonner';

interface AuthPageProps {
  defaultTab?: string;
}

export const AuthPage: React.FC<AuthPageProps> = ({ defaultTab = 'login' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isLoading, checkSession } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  const from = location.state?.from?.pathname || "/dashboard";
  
  // Check for tab parameter in location state
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    } else if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [location.state, defaultTab]);

  // Force auth check on component mount
  useEffect(() => {
    const verifyAuth = async () => {
      await checkSession();
      setInitialLoadComplete(true);
    };
    verifyAuth();
  }, [checkSession]);
  
  // Redirect if user is already logged in
  useEffect(() => {
    console.log("Auth page session check:", { hasSession: !!session, isLoading, initialLoadComplete });
    if (session && initialLoadComplete) {
      console.log("User already logged in, redirecting to:", from);
      toast.success("Already logged in", {
        description: "Redirecting to dashboard"
      });
      navigate(from, { replace: true });
    }
  }, [session, navigate, from, isLoading, initialLoadComplete]);
  
  if (isLoading || !initialLoadComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verifying authentication state...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <AuthHeader />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="register" className="space-y-4">
            <RegisterForm />
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex flex-col items-center border-t pt-4">
          <div className="text-center text-sm text-muted-foreground mb-2">
            By continuing, you agree to our <Button variant="link" className="p-0 h-auto text-primary">Terms of Service</Button> and <Button variant="link" className="p-0 h-auto text-primary">Privacy Policy</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
