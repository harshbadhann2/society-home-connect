import React, { useState, useEffect, useContext } from 'react';
import Layout from '@/components/layout/layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, Home, Key, BadgeIndianRupee, CalendarDays, UserRound, BellRing, FileText, Settings, Shield, CreditCard, Lock } from 'lucide-react';
import AuthContext from '@/context/AuthContext';
import { mockResidents } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Calendar, MessageSquare, Bed } from 'lucide-react';

const Profile: React.FC = () => {
  const { userRole, currentUser } = useContext(AuthContext);
  const { toast } = useToast();
  
  // Start with either the current user or a default
  const [profile, setProfile] = useState(currentUser || mockResidents[0]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: currentUser?.name || mockResidents[0].name,
    email: currentUser?.email || mockResidents[0].email,
    contact: currentUser?.contact || mockResidents[0].contact,
    bio: 'Resident at Nirvaan Heights since 2022. I enjoy participating in community events and using the society amenities.',
    address: `Flat ${currentUser?.apartment || mockResidents[0].apartment}, Nirvaan Heights, Mumbai, Maharashtra - 400076`
  });
  
  // Update form data whenever current user changes
  useEffect(() => {
    if (currentUser) {
      setProfile(currentUser);
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        contact: currentUser.contact || prev.contact,
        address: `Flat ${currentUser.apartment || 'A101'}, Nirvaan Heights, Mumbai, Maharashtra - 400076`
      }));
    }
  }, [currentUser]);
  
  // Activity data for the activity tab
  const [activityData, setActivityData] = useState([
    { id: 1, type: 'Amenity Booking', description: 'Booked Swimming Pool', date: '2025-05-01', time: '15:00' },
    { id: 2, type: 'Payment', description: 'Maintenance Fee Paid', date: '2025-04-28', amount: '₹2,500' },
    { id: 3, type: 'Complaint', description: 'Filed maintenance request', date: '2025-04-25', status: 'Resolved' },
    { id: 4, type: 'Notice', description: 'Viewed society meeting notice', date: '2025-04-22' },
    { id: 5, type: 'Visitor', description: 'Guest arrived', date: '2025-04-20', name: 'Amit Kumar' }
  ]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Amenity Booking': return <Bed className="h-5 w-5 text-blue-500" />;
      case 'Payment': return <CreditCard className="h-5 w-5 text-green-500" />;
      case 'Complaint': return <MessageSquare className="h-5 w-5 text-red-500" />;
      case 'Notice': return <FileText className="h-5 w-5 text-purple-500" />;
      case 'Visitor': return <User className="h-5 w-5 text-orange-500" />;
      default: return <Calendar className="h-5 w-5 text-gray-500" />;
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
                  <AvatarFallback className="bg-primary/10 text-primary text-4xl">{profile.name?.charAt(0) || '?'}</AvatarFallback>
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
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button variant="outline" className="justify-start" asChild>
                  <Link to="/complaints">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    My Complaints
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link to="/payments">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payment History
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link to="/amenities">
                    <Bed className="mr-2 h-4 w-4" />
                    Book Amenities
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link to="/notices">
                    <FileText className="mr-2 h-4 w-4" />
                    Society Notices
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                          <Home className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="address" 
                            className="pl-10" 
                            value={formData.address} 
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          placeholder="Tell us about yourself" 
                          className="min-h-[100px]" 
                          value={formData.bio} 
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <Button className="mt-4" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
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
                    
                    <div className="mt-8 space-y-4">
                      <h3 className="text-lg font-medium">Security Settings</h3>
                      <div className="border rounded-md p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Two-Factor Authentication</p>
                              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Enable</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Lock className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Login Alerts</p>
                              <p className="text-xs text-muted-foreground">Get notified of new logins</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Enable</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Settings className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Session Management</p>
                              <p className="text-xs text-muted-foreground">Manage active sessions</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">View</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent activity in the society</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {activityData.map(activity => (
                        <div key={activity.id} className="flex gap-4 items-start">
                          <div className="rounded-full p-2 bg-primary/10">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium">{activity.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(activity.date), 'MMM d, yyyy')}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {activity.type}
                              {activity.time && ` • ${activity.time}`}
                              {activity.amount && ` • ${activity.amount}`}
                              {activity.status && ` • ${activity.status}`}
                              {activity.name && ` • ${activity.name}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button variant="outline" className="w-full mt-6">
                      View All Activity
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
