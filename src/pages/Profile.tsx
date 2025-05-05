import React from 'react';
import Layout from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Pencil, CalendarDays, Mail, Phone, Home, Building } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../context/AuthContext';

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  const { currentUser } = useAuth();

  const { data: userData, isLoading } = useQuery({
    queryKey: ['staff', currentUser?.userId],
    queryFn: async () => {
      try {
        if (!currentUser?.userId) throw new Error('No user ID');
        
        // Attempt to find staff with matching user ID (simplified for demo)
        const { data: staffData, error } = await supabase
          .from('staff')
          .select('*')
          .eq('staff_id', 1) // In a real app, this would be related to the currentUser
          .single();

        if (error) throw error;
        
        return staffData;
      } catch (err) {
        console.error('Error fetching user data:', err);
        
        // Mock data in case of error
        return {
          staff_id: 1,
          name: 'Amit Kumar',
          role: 'Manager',
          contact_number: '9988776655',
          joining_date: '2023-01-15',
          salary: 45000
        };
      }
    },
    enabled: !!currentUser?.userId
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p>Loading profile data...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <Button variant="outline">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="col-span-3 md:col-span-1">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Avatar className="h-32 w-32 mb-5">
                <AvatarImage src="/placeholder.svg" alt="Profile picture" />
                <AvatarFallback>{userData?.name?.[0]}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold">{userData?.name}</h2>
              <p className="text-muted-foreground">{userData?.role}</p>
              <Button variant="secondary" className="mt-6">Change Photo</Button>
            </CardContent>
          </Card>

          <Card className="col-span-3 md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p>{new Date(userData?.joining_date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{userData?.contact_number ? `${userData.name.toLowerCase().replace(' ', '.')}@nirvaanheights.com` : 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{userData?.contact_number || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Position Details</h3>
                <div className="flex items-center gap-4">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p>{userData?.role || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p>Administration</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full sm:w-auto">Change Password</Button>
              <Button variant="outline" className="w-full sm:w-auto">Notification Preferences</Button>
              <Button variant="outline" className="w-full sm:w-auto">Security Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
