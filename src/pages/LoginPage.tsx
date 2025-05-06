
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Building, Home, Key, User, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User as UserType, mockUsers } from '@/types/database';
import AuthContext from '@/context/AuthContext';

const LoginPage: React.FC = () => {
  // State for admin login
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  // State for staff login
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  
  // State for resident login
  const [residentUsername, setResidentUsername] = useState('');
  const [residentPassword, setResidentPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setIsAuthenticated, setUserRole, setCurrentUser } = useContext(AuthContext);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Try to get user from database
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', adminUsername)
        .eq('role', 'admin')
        .single();
    
      if (error) {
        console.error('Database error:', error);
      
        // Fall back to mock data for development/testing
        const mockUser = mockUsers.find(u => u.username === adminUsername && u.role === 'admin');
      
        if (mockUser && (mockUser.password_hash === adminPassword || mockUser.password === adminPassword)) {
          toast({
            title: "Admin Login Successful (Dev Mode)",
            description: "You are now logged in as admin"
          });
          
          setIsAuthenticated(true);
          setUserRole('admin');
          setCurrentUser({
            id: mockUser.user_id,
            name: mockUser.username,
            email: mockUser.email
          });
          
          navigate('/dashboard');
          return;
        }
      
        toast({
          title: "Admin Login Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
        return;
      }
    
      const user = data as UserType;
    
      if (user && (user.password_hash === adminPassword || user.password === adminPassword)) {
        toast({
          title: "Admin Login Successful",
          description: "Welcome back!"
        });
        
        setIsAuthenticated(true);
        setUserRole('admin');
        setCurrentUser({
          id: user.user_id,
          name: user.username,
          email: user.email
        });
        
        navigate('/dashboard');
      } else {
        toast({
          title: "Admin Login Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Try to get user from database
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', staffUsername)
        .eq('role', 'staff')
        .single();
    
      if (error) {
        console.error('Database error:', error);
      
        // Fall back to mock data for development/testing
        const mockUser = mockUsers.find(u => u.username === staffUsername && u.role === 'staff');
      
        if (mockUser && (mockUser.password_hash === staffPassword || mockUser.password === staffPassword)) {
          toast({
            title: "Staff Login Successful (Dev Mode)",
            description: "You are now logged in as staff"
          });
          
          setIsAuthenticated(true);
          setUserRole('staff');
          setCurrentUser({
            id: mockUser.user_id,
            name: mockUser.username,
            email: mockUser.email
          });
          
          navigate('/dashboard');
          return;
        }
      
        toast({
          title: "Staff Login Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
        return;
      }
    
      const user = data as UserType;
    
      if (user && (user.password_hash === staffPassword || user.password === staffPassword)) {
        toast({
          title: "Staff Login Successful",
          description: "Welcome back!"
        });
        
        setIsAuthenticated(true);
        setUserRole('staff');
        setCurrentUser({
          id: user.user_id,
          name: user.username,
          email: user.email
        });
        
        navigate('/dashboard');
      } else {
        toast({
          title: "Staff Login Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResidentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Try to get user from database
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', residentUsername)
        .eq('role', 'resident')
        .single();
    
      if (error) {
        console.error('Database error:', error);
      
        // Fall back to mock data for development/testing
        const mockUser = mockUsers.find(u => u.username === residentUsername && u.role === 'resident');
      
        if (mockUser && (mockUser.password_hash === residentPassword || mockUser.password === residentPassword)) {
          toast({
            title: "Resident Login Successful (Dev Mode)",
            description: "You are now logged in as a resident"
          });
          
          setIsAuthenticated(true);
          setUserRole('resident');
          setCurrentUser({
            id: mockUser.user_id,
            name: mockUser.username,
            email: mockUser.email
          });
          
          navigate('/dashboard');
          return;
        }
      
        toast({
          title: "Resident Login Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
        return;
      }
    
      const user = data as UserType;
    
      if (user && (user.password_hash === residentPassword || user.password === residentPassword)) {
        toast({
          title: "Resident Login Successful",
          description: "Welcome back!"
        });
        
        setIsAuthenticated(true);
        setUserRole('resident');
        setCurrentUser({
          id: user.user_id,
          name: user.username,
          email: user.email
        });
        
        navigate('/dashboard');
      } else {
        toast({
          title: "Resident Login Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Apartment Management</CardTitle>
          <CardDescription className="text-center">Login to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="resident" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="resident">
                <Home className="mr-2 h-4 w-4" />
                Resident
              </TabsTrigger>
              <TabsTrigger value="staff">
                <User className="mr-2 h-4 w-4" />
                Staff
              </TabsTrigger>
              <TabsTrigger value="admin">
                <Building className="mr-2 h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>
            
            {/* Resident Login Tab */}
            <TabsContent value="resident" className="space-y-4">
              <form onSubmit={handleResidentLogin}>
                <div className="grid gap-2">
                  <Label htmlFor="resident-username">
                    <UserCircle className="mr-2 h-4 w-4 inline-block align-middle" />
                    Username
                  </Label>
                  <Input 
                    id="resident-username" 
                    placeholder="Enter your username" 
                    type="text"
                    value={residentUsername}
                    onChange={(e) => setResidentUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="resident-password">
                    <Key className="mr-2 h-4 w-4 inline-block align-middle" />
                    Password
                  </Label>
                  <Input 
                    id="resident-password" 
                    placeholder="Enter your password" 
                    type="password"
                    value={residentPassword}
                    onChange={(e) => setResidentPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button className="w-full mt-4" disabled={loading}>
                  {loading ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login as Resident"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            {/* Staff Login Tab */}
            <TabsContent value="staff" className="space-y-4">
              <form onSubmit={handleStaffLogin}>
                <div className="grid gap-2">
                  <Label htmlFor="staff-username">
                    <UserCircle className="mr-2 h-4 w-4 inline-block align-middle" />
                    Staff ID
                  </Label>
                  <Input 
                    id="staff-username" 
                    placeholder="Enter your staff ID" 
                    type="text"
                    value={staffUsername}
                    onChange={(e) => setStaffUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="staff-password">
                    <Key className="mr-2 h-4 w-4 inline-block align-middle" />
                    Password
                  </Label>
                  <Input 
                    id="staff-password" 
                    placeholder="Enter your password" 
                    type="password"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button className="w-full mt-4" disabled={loading}>
                  {loading ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login as Staff"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            {/* Admin Login Tab */}
            <TabsContent value="admin" className="space-y-4">
              <form onSubmit={handleAdminLogin}>
                <div className="grid gap-2">
                  <Label htmlFor="admin-username">
                    <UserCircle className="mr-2 h-4 w-4 inline-block align-middle" />
                    Admin Username
                  </Label>
                  <Input 
                    id="admin-username" 
                    placeholder="Enter admin username" 
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="admin-password">
                    <Key className="mr-2 h-4 w-4 inline-block align-middle" />
                    Password
                  </Label>
                  <Input 
                    id="admin-password" 
                    placeholder="Enter your password" 
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <Button className="w-full mt-4" disabled={loading}>
                  {loading ? (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login as Admin"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Contact admin for help with login credentials
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
