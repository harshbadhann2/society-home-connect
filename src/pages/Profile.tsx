
import React, { useEffect } from 'react';
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

// Define clearer types for different user profile data
interface ResidentData {
  name: string;
  email: string;
  contact_number: string;
  apartment_id?: number;
  status: string;
  resident_id: number;
  joining_date: string;
  department: string;
  joinDate: string;
}

interface StaffData {
  name: string;
  contact_number: string;
  staff_id: number;
  role: string;
  salary: number;
  joining_date: string;
  department: string;
  joinDate: string;
  email?: string;
}

interface FallbackData {
  name: string;
  email?: string;
  contact_number?: string;
  role?: string;
  department: string;
  joinDate: string;
}

type UserProfileData = ResidentData | StaffData | FallbackData;

// Type guard functions to check what type of data we have
function isResidentData(data: UserProfileData): data is ResidentData {
  return 'resident_id' in data && 'status' in data;
}

function isStaffData(data: UserProfileData): data is StaffData {
  return 'staff_id' in data && 'role' in data;
}

const Profile: React.FC<ProfileProps> = () => {
  const { currentUser, userRole } = useAuth();

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user-profile', currentUser?.userId, userRole],
    queryFn: async () => {
      if (!currentUser?.userId) return null;
      
      try {
        // Different queries based on user role
        if (userRole === 'resident') {
          const { data, error } = await supabase
            .from('resident')
            .select('*')
            .eq('email', currentUser.email)
            .single();
          
          if (error) throw error;
          return { 
            ...data,
            department: 'Resident',
            joinDate: data.joining_date
          } as ResidentData;
        } else if (userRole === 'staff' || userRole === 'admin') {
          const { data, error } = await supabase
            .from('staff')
            .select('*')
            .eq('staff_id', currentUser.id || 1) 
            .single();
          
          if (error) {
            console.error('Error fetching staff data:', error);
            // Fallback to using name match if ID doesn't work
            const { data: nameMatchData } = await supabase
              .from('staff')
              .select('*')
              .eq('name', currentUser.name)
              .single();
              
            if (nameMatchData) {
              return {
                ...nameMatchData,
                department: userRole === 'admin' ? 'Administration' : 'Staff',
                joinDate: nameMatchData.joining_date
              } as StaffData;
            }
          }
          
          if (data) {
            return {
              ...data,
              department: userRole === 'admin' ? 'Administration' : 'Staff',
              joinDate: data.joining_date
            } as StaffData;
          }
        }
        
        // Fallback to current user data from auth context
        return { 
          name: currentUser.name || 'User',
          email: currentUser.email,
          contact_number: currentUser.contact,
          role: userRole,
          department: userRole === 'admin' ? 'Administration' : (userRole === 'staff' ? 'Staff' : 'Resident'),
          joinDate: new Date().toISOString().split('T')[0]
        } as FallbackData;
      } catch (err) {
        console.error('Error fetching user data:', err);
        
        // Return current user data as fallback
        return { 
          name: currentUser.name || 'User',
          email: currentUser.email,
          contact_number: currentUser.contact,
          role: userRole,
          department: userRole === 'admin' ? 'Administration' : (userRole === 'staff' ? 'Staff' : 'Resident'),
          joinDate: new Date().toISOString().split('T')[0]
        } as FallbackData;
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
              <p className="text-muted-foreground">{userData?.role || userRole}</p>
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
                    <p>{userData?.joinDate ? new Date(userData.joinDate).toLocaleDateString() : 'Not available'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{currentUser?.email || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{userData?.contact_number || 'Not provided'}</p>
                  </div>
                </div>

                {userRole === 'resident' && isResidentData(userData!) && (
                  <div className="flex items-center gap-4">
                    <Home className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Apartment</p>
                      <p>A{userData?.apartment_id || 'Not assigned'}</p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">{userRole === 'resident' ? 'Residence Details' : 'Position Details'}</h3>
                <div className="flex items-center gap-4">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">{userRole === 'resident' ? 'Status' : 'Position'}</p>
                    <p>{isResidentData(userData!) ? userData.status : 
                        isStaffData(userData!) ? userData.role : 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p>{userData?.department || 'Not specified'}</p>
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
