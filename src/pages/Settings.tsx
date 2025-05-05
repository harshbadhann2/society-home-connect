import React, { useState } from 'react';
import Layout from '@/components/layout/layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Separator } from '@/components/ui/separator';

interface SettingsProps {}

const Settings: React.FC<SettingsProps> = () => {
  const { toast } = useToast();
  const [notificationEmail, setNotificationEmail] = useState('');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // User profile queries using resident table
  const { data: residents } = useQuery({
    queryKey: ['resident'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('resident')
          .select('*');

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching residents:', error);
        return [];
      }
    },
  });

  const handleUpdateEmail = () => {
    toast({
      title: 'Email Updated',
      description: 'Your notification email has been updated successfully.',
    });
  };

  const handleTogglePush = () => {
    setPushEnabled(!pushEnabled);
    toast({
      title: 'Push Notifications Updated',
      description: `Push notifications are now ${pushEnabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleToggleEmail = () => {
    setEmailEnabled(!emailEnabled);
    toast({
      title: 'Email Notifications Updated',
      description: `Email notifications are now ${emailEnabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleToggleSMS = () => {
    setSmsEnabled(!smsEnabled);
    toast({
      title: 'SMS Notifications Updated',
      description: `SMS notifications are now ${smsEnabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast({
      title: 'Appearance Updated',
      description: `Dark mode is now ${darkMode ? 'disabled' : 'enabled'}.`,
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid grid-cols-3 md:w-[400px] mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your personal information and manage your account settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={residents && residents.length > 0 ? residents[0].name : 'N/A'} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={residents && residents.length > 0 ? residents[0].email : 'N/A'} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apartment">Apartment</Label>
                  <Input id="apartment" defaultValue={residents && residents.length > 0 ? `A${residents[0].apartment_id}` : 'N/A'} disabled />
                </div>
                <Button variant="outline">Update Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notification-email">Email for Notifications</Label>
                  <Input
                    id="notification-email"
                    type="email"
                    placeholder="Enter your email"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                  />
                </div>
                <Button variant="outline" onClick={handleUpdateEmail}>Update Email</Button>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch
                    id="push-notifications"
                    checked={pushEnabled}
                    onCheckedChange={handleTogglePush}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch
                    id="email-notifications"
                    checked={emailEnabled}
                    onCheckedChange={handleToggleEmail}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                  <Switch
                    id="sms-notifications"
                    checked={smsEnabled}
                    onCheckedChange={handleToggleSMS}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of the application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={handleToggleDarkMode}
                  />
                </div>
                <Badge variant="secondary">
                  <span className="font-bold">Note:</span> Requires page reload to fully apply.
                </Badge>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
