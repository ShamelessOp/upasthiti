
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Moon, Sun, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [name, setName] = useState(user?.name || '');

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    toast({
      title: `Switched to ${!isDarkMode ? 'dark' : 'light'} mode`,
      duration: 2000,
    });
  };

  const handleSave = () => {
    // TODO: Implement save functionality when Supabase is connected
    toast({
      title: "Settings saved",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src="" />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <Button variant="outline">
              <Camera className="mr-2 h-4 w-4" />
              Change Photo
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user?.email} disabled />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <div className="text-sm text-muted-foreground">
                Switch between light and dark mode
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch 
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
              />
              <Moon className="h-4 w-4" />
            </div>
          </div>

          <Button onClick={handleSave} className="w-full sm:w-auto">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
