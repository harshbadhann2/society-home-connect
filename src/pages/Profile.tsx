
import React from 'react';
import Layout from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Home, Key } from 'lucide-react';
import { useContext } from 'react';
import AuthContext from '@/context/AuthContext';
import { mockResidents } from '@/types/database';

const Profile: React.FC = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  
  // In a real application, you would fetch this from the user's profile
  // For now, we'll use the first resident as an example
  const profile = mockResidents[0];
  
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
          <Card>
            <CardContent className="p-6 flex flex-col items-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
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

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="name" className="pl-10" defaultValue={profile.name} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="email" className="pl-10" defaultValue={profile.email} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" className="pl-10" defaultValue={profile.contact} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apartment">Apartment</Label>
                      <div className="relative">
                        <Home className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="apartment" className="pl-10" defaultValue={profile.apartment} readOnly />
                      </div>
                    </div>
                  </div>
                  <Button className="mt-4" type="submit">Save Changes</Button>
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
