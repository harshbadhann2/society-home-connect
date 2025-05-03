
import React, { useState } from 'react';
import Layout from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Home, Key, BadgeIndianRupee, CalendarDays, UserRound, BellRing, FileText } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '@/context/AuthContext';
import { mockResidents } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const Profile: React.FC = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  const { toast } = useToast();
  
  // In a real application, you would fetch this from the user's profile
  const [profile, setProfile] = useState(mockResidents[0]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    contact: profile.contact
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real application, this would update the data in Supabase
      // const { data, error } = await supabase
      //   .from('residents')
      //   .update({ name: formData.name, email: formData.email, contact: formData.contact })
      //   .eq('id', profile.id);
      
      // if (error) throw error;
      
      // Simulate successful update
      setProfile(prev => ({
        ...prev,
        name: formData.name,
        email: formData.email,
        contact: formData.contact
      }));
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was a problem updating your profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Profile</h2>
          <p className="text-muted-foreground">
            View and manage your personal information
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[250px_1fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <Avatar className="h-32 w-32 border-4 border-primary/20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary/10 text-primary text-4xl">{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="mt-6 space-y-1 text-center">
                  <h3 className="font-medium text-lg">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {profile.status} • {profile.apartment}
                  </p>
                </div>

                <div className="mt-6 w-full">
                  <Button variant="outline" className="w-full">
                    Change Photo
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <UserRound className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Member since 2022</span>
                </div>
                <div className="flex items-center">
                  <BadgeIndianRupee className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">All dues cleared</span>
                </div>
                <div className="flex items-center">
                  <BellRing className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Notifications enabled</span>
                </div>
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">Last login: Today</span>
                </div>
              </CardContent>
              <CardFooter>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  Active
                </Badge>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="name" 
                          className="pl-10" 
                          value={formData.name} 
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          className="pl-10" 
                          value={formData.email} 
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="contact" 
                          className="pl-10" 
                          value={formData.contact} 
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apartment">Apartment</Label>
                      <div className="relative">
                        <Home className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="apartment" className="pl-10" value={profile.apartment} readOnly />
                      </div>
                    </div>
                  </div>
                  <Button className="mt-4" type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="current-password" type="password" className="pl-10" />
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="new-password" type="password" className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="confirm-password" type="password" className="pl-10" />
                      </div>
                    </div>
                  </div>
                  <Button className="mt-4" type="submit">Update Password</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Important documents and receipts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-blue-600" />
                      <div>
                        <p className="font-medium">Maintenance Receipt</p>
                        <p className="text-sm text-muted-foreground">April 2025 • ₹2,500</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-blue-600" />
                      <div>
                        <p className="font-medium">Electricity Bill</p>
                        <p className="text-sm text-muted-foreground">March 2025 • ₹3,200</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-blue-600" />
                      <div>
                        <p className="font-medium">Society Rules</p>
                        <p className="text-sm text-muted-foreground">Last updated: Jan 2025</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Documents</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
