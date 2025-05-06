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

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Try to get user from database
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();
    
      if (error) {
        console.error('Database error:', error);
      
      // Fall back to mock data for development/testing
        const mockUser = mockUsers.find(u => u.username === username);
      
        if (mockUser && mockUser.password_hash === password) {
          toast({
            title: "Login Successful (Dev Mode)",
            description: "You are now logged in"
          });
          navigate('/dashboard');
          return;
        }
      
        toast({
          title: "Login Failed",
          description: "Invalid username or password",
          variant: "destructive"
        });
        return;
      }
    
      const user = data as User;
    
      if (user && user.password_hash === password) {
        toast({
          title: "Login Successful",
          description: "Welcome back!"
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Login Failed",
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
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access the dashboard</CardDescription>
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
          <Button onClick={handleLogin} disabled={loading}>
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

export default LoginPage;
