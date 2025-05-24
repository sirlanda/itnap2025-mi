'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Bell, UserCircle, Palette, Shield, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    testAssignments: true,
    planChanges: true,
    upcomingDeadlines: false,
    executionCompletion: true,
  });
  const [profile, setProfile] = useState({
    username: "john.doe",
    email: "john.doe@example.com",
  });

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSaveChanges = () => {
    // Mock save action
    console.log("Settings saved:", { profile, notifications });
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>

      {/* Profile Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <UserCircle className="mr-2 h-6 w-6 text-primary" />
            Profile Settings
          </CardTitle>
          <CardDescription>Manage your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" value={profile.username} onChange={handleProfileChange} placeholder="lastname.firstname" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={profile.email} onChange={handleProfileChange} placeholder="you@example.com" />
          </div>
          <Button variant="outline">Change Password</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Bell className="mr-2 h-6 w-6 text-primary" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Configure how you receive notifications from TestFlow.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(Object.keys(notifications) as Array<keyof typeof notifications>).map((key) => (
            <div key={key} className="flex items-center justify-between p-3 bg-muted/20 rounded-md hover:bg-muted/40 transition-colors">
              <Label htmlFor={key} className="text-sm font-medium capitalize cursor-pointer">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
              <Switch
                id={key}
                checked={notifications[key]}
                onCheckedChange={() => handleNotificationChange(key)}
                aria-label={`Toggle ${key.replace(/([A-Z])/g, ' $1').trim()} notifications`}
              />
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* Other Settings (Placeholders) */}
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Palette className="mr-2 h-6 w-6 text-primary" />
            Appearance (Placeholder)
          </CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="h-20 flex items-center justify-center text-muted-foreground">
            Theme options will be available here.
        </CardContent>
      </Card>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Shield className="mr-2 h-6 w-6 text-primary" />
            Security (Placeholder)
          </CardTitle>
          <CardDescription>Manage security settings like 2FA.</CardDescription>
        </CardHeader>
        <CardContent className="h-20 flex items-center justify-center text-muted-foreground">
            Security configurations will appear here.
        </CardContent>
      </Card>
      
      <div className="flex justify-end pt-4">
        <Button onClick={handleSaveChanges} size="lg">
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>
    </div>
  );
}
