
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PageTransition } from "@/components/layout/PageTransition";
import { Apple, Mail, Github, Laptop, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activateUser, sendVerificationEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [activatingUser, setActivatingUser] = useState(false);
  const [sendingMagicLink, setSendingMagicLink] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setShowVerificationAlert(true);
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully signed in",
          description: "Welcome back!",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      
      setShowVerificationAlert(true);
      
      // Send a custom verification email
      await sendVerificationEmail(email);
      
      toast({
        title: "Sign up successful",
        description: "Please check your email for verification instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setResendingEmail(true);
    
    try {
      await sendVerificationEmail(email);
    } finally {
      setResendingEmail(false);
    }
  };

  const handleActivateUser = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to activate",
        variant: "destructive",
      });
      return;
    }
    
    setActivatingUser(true);
    
    try {
      // First, try direct login bypassing confirmation
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        if (error.message.includes("Email not confirmed")) {
          // For development only: Force login by sending a magic link
          const { error: magicLinkError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: `${window.location.origin}/dashboard`,
            }
          });
          
          if (magicLinkError) throw magicLinkError;
          
          toast({
            title: "Magic link sent",
            description: "Check your email for a link to sign in directly",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully signed in",
          description: "Welcome back!",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error activating user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setActivatingUser(false);
    }
  };

  const sendMagicLink = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setSendingMagicLink(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Magic link sent",
        description: "Check your email for a link to sign in",
      });
    } catch (error: any) {
      toast({
        title: "Error sending magic link",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSendingMagicLink(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'apple' | 'azure') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Patorama Studios</CardTitle>
            <CardDescription>Sign in to access your account</CardDescription>
          </CardHeader>
          
          {showVerificationAlert && (
            <div className="px-6">
              <Alert variant="default" className="mb-4 bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-800">Email verification required</AlertTitle>
                <AlertDescription className="text-amber-700">
                  Please check your email for a verification link. 
                  <Button 
                    variant="link" 
                    onClick={resendVerificationEmail}
                    disabled={resendingEmail}
                    className="text-amber-600 p-0 h-auto font-semibold"
                  >
                    {resendingEmail ? "Sending..." : "Resend verification email"}
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleEmailSignIn}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In with Email"}
                  </Button>
                  
                  {/* Magic link button */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full" 
                    onClick={sendMagicLink}
                    disabled={sendingMagicLink}
                  >
                    {sendingMagicLink ? "Sending magic link..." : "Sign in with Magic Link"}
                  </Button>
                  
                  {/* Development helper button */}
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full border-amber-500 text-amber-700 hover:bg-amber-50" 
                    onClick={handleActivateUser}
                    disabled={activatingUser}
                  >
                    {activatingUser ? "Sending magic link..." : "Send Magic Link (Dev Only)"}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" type="button" onClick={() => signInWithProvider('google')}>
                      <Mail className="mr-2 h-4 w-4" /> Google
                    </Button>
                    <Button variant="outline" type="button" onClick={() => signInWithProvider('apple')}>
                      <Apple className="mr-2 h-4 w-4" /> Apple
                    </Button>
                    <Button variant="outline" type="button" onClick={() => signInWithProvider('azure')}>
                      <Laptop className="mr-2 h-4 w-4" /> Microsoft
                    </Button>
                  </div>
                </CardContent>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleEmailSignUp}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </CardContent>
              </form>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex flex-col">
            <p className="mt-2 text-xs text-center text-gray-700">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Login;
