import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Key, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, mockUsers } from '@/types/database';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Use mockUsers for fallback
  const adminLoginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Try to get user from Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
      
      if (error) {
        console.error('Database error:', error);
        
        // Fall back to mock users for development/testing
        const mockUser = mockUsers.find(u => u.username === username);
        
        if (mockUser && mockUser.password_hash === password) {
          toast({
            title: "Success! (Development Mode)",
            description: "You are now logged in using mock data",
          });
          navigate('/');
          return;
        }
        
        toast({
          title: "Authentication Error",
          description: "Invalid username or password",
          variant: "destructive"
        });
        return;
      }
      
      const user = data as User;
      
      // Here you would normally use a secure password comparison
      // This is just for demonstration - in a real app, NEVER store
      // or compare passwords in the frontend
      if (user && user.password_hash === password) {
        // Set auth context state or session
        toast({
          title: "Success!",
          description: "You are now logged in",
        });
        
        // Navigate to dashboard
        navigate('/');
      } else {
        toast({
          title: "Authentication Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Login error:', error);
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
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">
              <UserCircle className="mr-2 h-4 w-4 inline-block align-middle" />
              Username
            </Label>
            <Input 
              id="username" 
              placeholder="Enter your username" 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">
              <Key className="mr-2 h-4 w-4 inline-block align-middle" />
              Password
            </Label>
            <Input 
              id="password" 
              placeholder="Enter your password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={adminLoginHandler} disabled={loading}>
            {loading ? (
              <>
                <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
