
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, DollarSign, Package, UserCheck, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h2>
        <p className="text-muted-foreground">
          Here's an overview of your construction site management
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">152</div>
                <p className="text-xs text-muted-foreground">
                  +2 since last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">124</div>
                <p className="text-xs text-muted-foreground">
                  81.6% of total workers
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Payroll</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹284,500</div>
                <p className="text-xs text-muted-foreground">
                  +₹24,000 from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">
                  Items need reordering
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Attendance</CardTitle>
                <CardDescription>
                  Attendance trends over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {/* Placeholder for chart */}
                <div className="h-[200px] w-full rounded-md bg-muted/30 flex items-center justify-center">
                  <p className="text-muted-foreground">Attendance Chart</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>
                  Latest system activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Attendance Marked</p>
                      <p className="text-xs text-muted-foreground">
                        Site A: 45 workers checked in
                      </p>
                      <p className="text-xs text-muted-foreground">30 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Payroll Generated</p>
                      <p className="text-xs text-muted-foreground">
                        Weekly payroll for Site B processed
                      </p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Inventory Updated</p>
                      <p className="text-xs text-muted-foreground">
                        50 bags of cement added to inventory
                      </p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Overtime Recorded</p>
                      <p className="text-xs text-muted-foreground">
                        15 workers logged overtime hours
                      </p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>
                View and manage attendance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground">Detailed attendance data will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Summary</CardTitle>
              <CardDescription>
                Review and process payroll information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground">Payroll data and reports will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>
                Monitor inventory levels and manage stock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground">Inventory tracking information will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
