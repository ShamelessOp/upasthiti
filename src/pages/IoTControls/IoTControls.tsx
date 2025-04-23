
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, RefreshCcw, Wifi } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { localStorageService } from '@/services/localStorage';

// IoT Device Type
interface IoTDevice {
  id: string;
  name: string;
  dashboardUrl: string;
  status: 'online' | 'offline';
  createdAt: string;
  createdBy: string;
}

// Demo IoT Devices
const DEMO_IOT_DEVICES: IoTDevice[] = [
  {
    id: 'iot-001',
    name: 'Main Gate Control',
    dashboardUrl: 'https://blynk.cloud/dashboard/12345',
    status: 'online',
    createdAt: '2025-04-01T09:00:00Z',
    createdBy: 'admin@upastithi.com'
  },
  {
    id: 'iot-002',
    name: 'Attendance Kiosk',
    dashboardUrl: 'https://blynk.cloud/dashboard/67890',
    status: 'online',
    createdAt: '2025-04-02T10:30:00Z',
    createdBy: 'admin@upastithi.com'
  },
  {
    id: 'iot-003',
    name: 'Site Camera',
    dashboardUrl: 'https://blynk.cloud/dashboard/13579',
    status: 'offline',
    createdAt: '2025-04-03T14:15:00Z',
    createdBy: 'admin@upastithi.com'
  }
];

export default function IoTControls() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [iotDevices, setIotDevices] = useState<IoTDevice[]>([]);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    dashboardUrl: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadDevices();
  }, [user]);

  const loadDevices = () => {
    setIsLoading(true);
    
    try {
      // Try to load from local storage first
      let devices = localStorageService.get<IoTDevice[]>('iot_devices') || [];
      
      // If user is admin@upastithi.com, add demo devices if no devices exist
      if (user?.email === 'admin@upastithi.com' && devices.length === 0) {
        devices = [...DEMO_IOT_DEVICES];
        localStorageService.set('iot_devices', devices);
      } else if (user) {
        // Filter devices for current user
        devices = devices.filter(device => 
          device.createdBy === user.email || 
          device.createdBy === 'admin@upastithi.com'  // Always show admin demo devices
        );
      }
      
      setIotDevices(devices);
    } catch (error) {
      console.error("Error loading IoT devices:", error);
      toast({
        title: "Error",
        description: "Failed to load IoT devices",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDevice = () => {
    setIsAddingDevice(true);
    
    try {
      if (!newDevice.name || !newDevice.dashboardUrl) {
        toast({
          title: "Validation Error",
          description: "Please fill in all fields",
          variant: "destructive"
        });
        return;
      }

      // Ensure URL has http/https protocol
      let url = newDevice.dashboardUrl;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      
      const newIoTDevice: IoTDevice = {
        id: `iot-${Date.now()}`,
        name: newDevice.name,
        dashboardUrl: url,
        status: 'online',
        createdAt: new Date().toISOString(),
        createdBy: user?.email || 'unknown'
      };
      
      // Add to local storage
      const currentDevices = localStorageService.get<IoTDevice[]>('iot_devices') || [];
      const updatedDevices = [...currentDevices, newIoTDevice];
      localStorageService.set('iot_devices', updatedDevices);
      
      // Update state
      setIotDevices(prev => [...prev, newIoTDevice]);
      
      // Reset form
      setNewDevice({
        name: '',
        dashboardUrl: ''
      });
      
      setDialogOpen(false);
      
      toast({
        title: "Success",
        description: "IoT device added successfully"
      });
      
      // Redirect to the dashboard URL
      window.open(url, '_blank');
      
    } catch (error) {
      console.error("Error adding IoT device:", error);
      toast({
        title: "Error",
        description: "Failed to add IoT device",
        variant: "destructive"
      });
    } finally {
      setIsAddingDevice(false);
    }
  };

  const handleDeviceClick = (device: IoTDevice) => {
    window.open(device.dashboardUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">IoT Controls</h2>
          <p className="text-muted-foreground">Manage your connected IoT devices</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadDevices} disabled={isLoading}>
            <RefreshCcw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New IoT Device</DialogTitle>
                <DialogDescription>
                  Connect a new IoT device to your dashboard
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Device Name</Label>
                  <Input
                    id="name"
                    placeholder="Attendance Kiosk"
                    value={newDevice.name}
                    onChange={(e) => setNewDevice({...newDevice, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">Dashboard URL</Label>
                  <Input
                    id="url"
                    placeholder="https://blynk.cloud/dashboard/your-id"
                    value={newDevice.dashboardUrl}
                    onChange={(e) => setNewDevice({...newDevice, dashboardUrl: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the full URL to your IoT device dashboard
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDevice} disabled={isAddingDevice}>
                  {isAddingDevice && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Device
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Devices</TabsTrigger>
          <TabsTrigger value="online">Online</TabsTrigger>
          <TabsTrigger value="offline">Offline</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : iotDevices.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {iotDevices.map((device) => (
                <Card 
                  key={device.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleDeviceClick(device)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wifi className="h-5 w-5" />
                      {device.name}
                    </CardTitle>
                    <CardDescription>{device.dashboardUrl}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className={`mr-2 h-2 w-2 rounded-full ${
                        device.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <p className="text-sm capitalize">{device.status}</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">
                      Added: {new Date(device.createdAt).toLocaleDateString()}
                    </p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-lg font-medium">No IoT devices found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by adding your first IoT device
              </p>
              <Button className="mt-4" onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Device
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="online" className="mt-6">
          {/* Filter for online devices */}
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : iotDevices.filter(d => d.status === 'online').length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {iotDevices
                .filter(d => d.status === 'online')
                .map((device) => (
                  <Card 
                    key={device.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleDeviceClick(device)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wifi className="h-5 w-5" />
                        {device.name}
                      </CardTitle>
                      <CardDescription>{device.dashboardUrl}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                        <p className="text-sm capitalize">Online</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-muted-foreground">
                        Added: {new Date(device.createdAt).toLocaleDateString()}
                      </p>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-lg font-medium">No online IoT devices</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add an IoT device or check connectivity
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="offline" className="mt-6">
          {/* Filter for offline devices */}
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : iotDevices.filter(d => d.status === 'offline').length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {iotDevices
                .filter(d => d.status === 'offline')
                .map((device) => (
                  <Card 
                    key={device.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleDeviceClick(device)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wifi className="h-5 w-5" />
                        {device.name}
                      </CardTitle>
                      <CardDescription>{device.dashboardUrl}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-red-500" />
                        <p className="text-sm capitalize">Offline</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-muted-foreground">
                        Added: {new Date(device.createdAt).toLocaleDateString()}
                      </p>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-lg font-medium">No offline IoT devices</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                All devices are currently online
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
