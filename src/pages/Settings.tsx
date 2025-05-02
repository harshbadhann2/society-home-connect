
import React, { useState, useContext } from 'react';
import Layout from '@/components/layout/layout';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import AuthContext from '@/context/AuthContext';

const Settings: React.FC = () => {
  const { userRole } = useContext(AuthContext);
  const { toast } = useToast();
  const [accountSettings, setAccountSettings] = useState({
    name: 'John Doe',
    email: userRole === 'admin' ? 'admin@example.com' : userRole === 'staff' ? 'staff@example.com' : 'resident@example.com',
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

  const handleAccountSave = () => {
    toast({
      title: 'Account settings saved',
      description: 'Your account settings have been updated successfully.',
    });
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
                  <Button onClick={handleAccountSave}>Save Changes</Button>
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
      </div>
    </Layout>
  );
};

export default Settings;
