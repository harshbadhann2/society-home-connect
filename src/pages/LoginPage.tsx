
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { mockUsers } from '@/types/database';
import { User, Building, Shield, Key } from 'lucide-react';
import AuthContext from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LocationState {
  defaultTab?: string;
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [defaultTab, setDefaultTab] = useState('resident');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useContext(AuthContext);
  
  // Type-safe setters
  const setIsAuthenticated = auth.setIsAuthenticated;
  const setUserRole = auth.setUserRole;

  useEffect(() => {
    // Check if there's a default tab in the location state
    const state = location.state as LocationState;
    if (state?.defaultTab) {
      setDefaultTab(state.defaultTab);
    }
  }, [location]);

  const handleResidentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, try to authenticate with Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password) // NOTE: In a real application, never store passwords in plaintext
        .eq('role', 'resident')
        .single();

      if (error) {
        console.info('Supabase resident login error:', error);
        console.info('Falling back to mock users');

        // Fall back to mock data
        const user = mockUsers.find(user => user.email === email && user.password === password && user.role === 'resident');
        
        if (!user) {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid resident credentials.",
          });
          setIsLoading(false);
          return;
        }
        
        // Use mock user
        setIsAuthenticated(true);
        setUserRole('resident');
        toast({
          title: "Resident Login Successful",
          description: "Welcome to Nirvaan Heights!",
        });
        navigate('/');
        return;
      }

      // Supabase authentication successful
      setIsAuthenticated(true);
      setUserRole('resident');
      toast({
        title: "Resident Login Successful",
        description: "Welcome to Nirvaan Heights!",
      });
      navigate('/');

    } catch (err) {
      console.error('Login error:', err);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, try to authenticate with Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password) // NOTE: In a real application, never store passwords in plaintext
        .eq('role', 'staff')
        .single();

      if (error) {
        console.info('Supabase staff login error:', error);
        console.info('Falling back to mock users');

        // Fall back to mock data
        const user = mockUsers.find(user => user.email === email && user.password === password && user.role === 'staff');
        
        if (!user) {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid staff credentials.",
          });
          setIsLoading(false);
          return;
        }
        
        // Use mock user
        setIsAuthenticated(true);
        setUserRole('staff');
        toast({
          title: "Staff Login Successful",
          description: "Welcome back, staff member!",
        });
        navigate('/');
        return;
      }

      // Supabase authentication successful
      setIsAuthenticated(true);
      setUserRole('staff');
      toast({
        title: "Staff Login Successful",
        description: "Welcome back, staff member!",
      });
      navigate('/');

    } catch (err) {
      console.error('Login error:', err);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, try to authenticate with Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password) // NOTE: In a real application, never store passwords in plaintext
        .eq('role', 'admin')
        .single();

      if (error) {
        console.info('Supabase admin login error:', error);
        console.info('Falling back to mock users');

        // Fall back to mock data
        const user = mockUsers.find(user => user.email === email && user.password === password && user.role === 'admin');
        
        if (!user) {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid administrator credentials.",
          });
          setIsLoading(false);
          return;
        }
        
        // Use mock user
        setIsAuthenticated(true);
        setUserRole('admin');
        toast({
          title: "Admin Login Successful",
          description: "Welcome back, administrator!",
        });
        navigate('/');
        return;
      }

      // Supabase authentication successful
      setIsAuthenticated(true);
      setUserRole('admin');
      toast({
        title: "Admin Login Successful",
        description: "Welcome back, administrator!",
      });
      navigate('/');

    } catch (err) {
      console.error('Login error:', err);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Nirvaan Heights</CardTitle>
          <CardDescription>
            Society Management Portal Login
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="resident">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Resident</span>
              </TabsTrigger>
              <TabsTrigger value="staff">
                <Building className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Staff</span>
              </TabsTrigger>
              <TabsTrigger value="admin">
                <Shield className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Admin</span>
              </TabsTrigger>
            </TabsList>
            
            <Alert className="mb-4">
              <Key className="h-4 w-4" />
              <AlertDescription>
                User accounts from your database have been integrated. You can log in using the email addresses shown below.
              </AlertDescription>
            </Alert>
            
            <TabsContent value="resident">
              <form onSubmit={handleResidentLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resident-email">Email</Label>
                  <Input 
                    id="resident-email" 
                    type="email" 
                    placeholder="rajesh.sharma@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resident-password">Password</Label>
                    <Link to="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="resident-password" 
                    type="password"
                    placeholder="resident123" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Resident"}
                </Button>
                <div className="text-center text-sm space-y-1 text-muted-foreground mt-2">
                  <p>Available resident accounts:</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>rajesh.sharma@example.com</div>
                    <div>amit.singh@example.com</div>
                    <div>ravi.mehta@example.com</div>
                    <div>neha.verma@example.com</div>
                  </div>
                  <p className="pt-1">Password for all accounts: resident123</p>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="staff">
              <form onSubmit={handleStaffLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="staff-email">Email</Label>
                  <Input 
                    id="staff-email" 
                    type="email" 
                    placeholder="sunil.kumar@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="staff-password">Password</Label>
                    <Link to="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="staff-password" 
                    type="password"
                    placeholder="staff123" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login as Staff"}
                </Button>
                <div className="text-center text-sm space-y-1 text-muted-foreground mt-2">
                  <p>Available staff accounts:</p>
                  <div className="grid grid-cols-1 gap-1 text-xs">
                    <div>sunil.kumar@example.com (Cleaner)</div>
                    <div>pooja.yadav@example.com (Security)</div>
                    <div>rajeev.kumar@example.com (Gardener)</div>
                  </div>
                  <p className="pt-1">Password for all accounts: staff123</p>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="admin">
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input 
                    id="admin-email" 
                    type="email" 
                    placeholder="admin@nirvaanheights.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admin-password">Password</Label>
                    <Link to="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="admin-password" 
                    type="password"
                    placeholder="admin123" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : "Login as Administrator"}
                </Button>
                <div className="text-center text-sm text-muted-foreground mt-2">
                  <p>Admin account: admin@nirvaanheights.com</p>
                  <p>Password: admin123</p>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <div className="text-center text-sm text-muted-foreground">
            ©2025 Nirvaan Heights Society Management
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
