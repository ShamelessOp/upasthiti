
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplet, Activity, Power, ToggleLeft } from 'lucide-react';

export default function IoTControls() {
  const handleWaterPumpClick = () => {
    // Redirect to the Blynk dashboard
    window.open('https://blynk.cloud/dashboard/278932/global/devices/1/organization/278932/devices/1069329/dashboard', '_blank');
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">IoT Controls</h2>
          <p className="text-muted-foreground">
            Manage your IoT devices and sensors
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="bg-primary/5 p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-2">
                <Droplet className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Water Pump Control</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <CardDescription>
              Control your water pump remotely using Blynk IoT platform
            </CardDescription>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Status:</span>
                <span className="flex items-center gap-1 text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span> Online
                </span>
              </div>
              
              <Button 
                onClick={handleWaterPumpClick} 
                className="w-full"
                variant="default"
              >
                <Power className="mr-2 h-4 w-4" />
                Control Water Pump
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Additional mock IoT devices */}
        <Card className="overflow-hidden transition-all hover:shadow-md opacity-60">
          <CardHeader className="bg-primary/5 p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-2">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Moisture Sensors</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardDescription className="mb-3">
              View soil moisture levels across different sites
            </CardDescription>
            <Button variant="outline" className="w-full" disabled>
              View Sensors
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden transition-all hover:shadow-md opacity-60">
          <CardHeader className="bg-primary/5 p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-primary/10 p-2">
                <ToggleLeft className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Automated Systems</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <CardDescription className="mb-3">
              Configure automated watering schedules
            </CardDescription>
            <Button variant="outline" className="w-full" disabled>
              Configure
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
