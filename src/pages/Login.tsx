
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { mockUsers } from '@/types/database';
import AuthContext from '@/context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserRole } = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, try to authenticate with Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password) // NOTE: In a real application, never store passwords in plaintext
        .eq('role', 'user')
        .single();

      if (error) {
        console.info('Supabase login error:', error);
        console.info('Falling back to mock users');

        // Fall back to mock data
        const user = mockUsers.find(user => user.email === email && user.password === password && user.role === 'user');
        
        if (!user) {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid email or password.",
          });
          setIsLoading(false);
          return;
        }
        
        // Use mock user
        setIsAuthenticated(true);
        setUserRole('user');
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate('/');
        return;
      }

      // Supabase authentication successful
      setIsAuthenticated(true);
      setUserRole('user');
      toast({
        title: "Login Successful",
        description: "Welcome back!",
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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">User Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the resident portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm text-muted-foreground mt-2">
            Are you an administrator?{" "}
            <Link to="/admin-login" className="text-primary hover:underline">
              Admin Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
