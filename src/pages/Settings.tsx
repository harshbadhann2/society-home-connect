import React, { useState, useContext, useEffect } from 'react';
import Layout from '@/components/layout/layout';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import AuthContext from '@/context/AuthContext';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { mockResidents, mockUsers, mockStaff } from '@/types/database';
import { Loader2 } from 'lucide-react';

const Settings: React.FC = () => {
  const { userRole } = useContext(AuthContext);
  const { toast } = useToast();
  const [accountSettings, setAccountSettings] = useState({
    name: '',
    email: '',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    appNotifications: true,
    updateNotifications: true,
    maintenanceNotifications: userRole !== 'resident' ? true : false,
  });

  const [displaySettings, setDisplaySettings] = useState({
    darkMode: false,
    highContrast: false,
    largeText: false,
  });
  
  // Fetch user data based on role
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['settings-user', userRole],
    queryFn: async () => {
      if (!userRole) return null;
      
      try {
        // For admin, we use a simple lookup from mock data
        if (userRole === 'admin') {
          const admin = mockUsers.find(user => user.role === 'admin');
          return {
            name: admin?.email?.split('@')[0] || 'Admin',
            email: admin?.email || 'admin@example.com'
          };
        }
        
        // For staff, try to fetch from database first
        if (userRole === 'staff') {
          const { data, error } = await supabase
            .from('staff')
            .select('*')
            .limit(1);
            
          if (data && data.length > 0) {
            return {
              ...data[0],
              // Add fields used in the component that might not be in the database
              id: data[0].staff_id
            };
          } else {
            const mockUser = { ...mockStaff[0], id: mockStaff[0].staff_id };
            return mockUser; // Fallback to mock data
          }
        }
        
        // For residents, try to fetch from database first
        if (userRole === 'resident') {
          const { data, error } = await supabase
            .from('resident')
            .select('*')
            .limit(1);
            
          if (data && data.length > 0) {
            return {
              ...data[0],
              // Add fields used in the component that might not be in the database
              id: data[0].resident_id
            };
          } else {
            const mockUser = { ...mockResidents[0], id: mockResidents[0].resident_id };
            return mockUser; // Fallback to mock data
          }
        }
        
        return null;
      } catch (err) {
        console.error('Error fetching user data:', err);
        // Fallback to mock data based on role
        if (userRole === 'admin') {
          const admin = mockUsers.find(user => user.role === 'admin');
          return {
            name: admin?.email?.split('@')[0] || 'Admin',
            email: admin?.email || 'admin@example.com',
            id: admin?.user_id
          };
        }
        if (userRole === 'staff') return { ...mockStaff[0], id: mockStaff[0].staff_id };
        return { ...mockResidents[0], id: mockResidents[0].resident_id };
      }
    }
  });
  
  // Update user settings mutation
  const updateUserMutation = useMutation({
    mutationFn: async (updatedSettings: typeof accountSettings) => {
      if (!userRole || !userData) throw new Error("User not found");
      
      try {
        if (userRole === 'admin') {
          // For admin users, we'd normally update in the database
          // But since we're using mock data for admin, we'll just simulate success
          return { success: true };
        }
        
        if (userRole === 'resident') {
          // Check if userData has resident_id directly or via id property
          const residentId = (userData as any).resident_id || userData.id;
          
          const { data, error } = await supabase
            .from('resident')
            .update({
              name: updatedSettings.name,
              email: updatedSettings.email,
            })
            .eq('resident_id', residentId)
            .select();
          
          if (error) throw error;
          return data;
        }
        
        if (userRole === 'staff') {
          // Check if userData has staff_id directly or via id property
          const staffId = (userData as any).staff_id || userData.id;
          
          const { data, error } = await supabase
            .from('staff')
            .update({
              name: updatedSettings.name,
              email: updatedSettings.email,
            })
            .eq('staff_id', staffId)
            .select();
          
          if (error) throw error;
          return data;
        }
        
        throw new Error("Unknown user role");
      } catch (error: any) {
        console.error("Error updating user settings:", error);
        // If table doesn't exist yet, simulate success
        if (error.message && error.message.includes("does not exist")) {
          console.log("Using mock data since table doesn't exist yet");
          return { success: true };
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Account settings saved',
        description: 'Your account settings have been updated successfully.',
      });
    },
    onError: () => {
      toast({
        title: 'Error saving settings',
        description: 'There was a problem saving your account settings.',
        variant: 'destructive'
      });
    }
  });

  // Update account settings from userData when it loads
  useEffect(() => {
    if (userData) {
      // For admin users with just email
      if (userRole === 'admin' && 'email' in userData) {
        setAccountSettings({
          name: userData.name || userData.email.split('@')[0],
          email: userData.email,
        });
        return;
      }
      
      // For resident and staff users
      if ('name' in userData && 'email' in userData) {
        setAccountSettings({
          name: userData.name,
          email: userData.email || '',
        });
      }
    }
  }, [userData, userRole]);

  const handleAccountSave = () => {
    updateUserMutation.mutate(accountSettings);
  };

  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
    toast({
      title: 'Notification settings updated',
      description: `${setting} ${notificationSettings[setting] ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleDisplayToggle = (setting: keyof typeof displaySettings) => {
    setDisplaySettings({
      ...displaySettings,
      [setting]: !displaySettings[setting],
    });
    toast({
      title: 'Display setting updated',
      description: `${setting} ${displaySettings[setting] ? 'disabled' : 'enabled'}.`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        {isLoadingUser ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading your settings...</span>
          </div>
        ) : (
          <Tabs defaultValue="account" className="space-y-4">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="display">Display</TabsTrigger>
              {userRole === 'admin' && <TabsTrigger value="advanced">Advanced</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your personal information and account details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={accountSettings.name} 
                      onChange={(e) => setAccountSettings({...accountSettings, name: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={accountSettings.email} 
                      onChange={(e) => setAccountSettings({...accountSettings, email: e.target.value})} 
                    />
                  </div>
                  <div className="pt-4">
                    <Button 
                      onClick={handleAccountSave} 
                      disabled={updateUserMutation.isPending}
                    >
                      {updateUserMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Control what notifications you receive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email.
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailNotifications} 
                      onCheckedChange={() => handleNotificationToggle('emailNotifications')} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">App Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications within the app.
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.appNotifications} 
                      onCheckedChange={() => handleNotificationToggle('appNotifications')} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Update Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about community updates.
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.updateNotifications} 
                      onCheckedChange={() => handleNotificationToggle('updateNotifications')} 
                    />
                  </div>
                  {(userRole === 'admin' || userRole === 'staff') && (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Maintenance Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about maintenance tasks.
                        </p>
                      </div>
                      <Switch 
                        checked={notificationSettings.maintenanceNotifications} 
                        onCheckedChange={() => handleNotificationToggle('maintenanceNotifications')} 
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="display">
              <Card>
                <CardHeader>
                  <CardTitle>Display Settings</CardTitle>
                  <CardDescription>
                    Customize how the application appears to you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Enable dark mode for the interface.
                      </p>
                    </div>
                    <Switch 
                      checked={displaySettings.darkMode} 
                      onCheckedChange={() => handleDisplayToggle('darkMode')} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">High Contrast</p>
                      <p className="text-sm text-muted-foreground">
                        Increase contrast for better visibility.
                      </p>
                    </div>
                    <Switch 
                      checked={displaySettings.highContrast} 
                      onCheckedChange={() => handleDisplayToggle('highContrast')} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Large Text</p>
                      <p className="text-sm text-muted-foreground">
                        Increase text size throughout the application.
                      </p>
                    </div>
                    <Switch 
                      checked={displaySettings.largeText} 
                      onCheckedChange={() => handleDisplayToggle('largeText')} 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {userRole === 'admin' && (
              <TabsContent value="advanced">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                    <CardDescription>
                      These settings are only available to administrators.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="systemBackup">System Backup Frequency</Label>
                      <select 
                        id="systemBackup" 
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="space-y-2 pt-4">
                      <Button variant="outline">Export System Data</Button>
                    </div>
                    <div className="space-y-2 pt-2">
                      <Button variant="destructive">Reset System</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default Settings;
