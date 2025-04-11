
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for demonstration purposes
const MOCK_SITES = [
  { id: "1", name: "Site A - Residential Complex" },
  { id: "2", name: "Site B - Commercial Building" },
  { id: "3", name: "Site C - Highway Project" },
];

const MOCK_ATTENDANCE_DATA = [
  {
    id: "1",
    workerId: "W001",
    name: "Rajesh Kumar",
    site: "Site A - Residential Complex",
    date: "2025-04-11",
    checkInTime: "08:00 AM",
    checkOutTime: "05:00 PM",
    status: "Present",
    overtime: "1 hour",
  },
  {
    id: "2",
    workerId: "W002",
    name: "Sunil Sharma",
    site: "Site A - Residential Complex",
    date: "2025-04-11",
    checkInTime: "08:15 AM",
    checkOutTime: "04:45 PM",
    status: "Present",
    overtime: "0 hour",
  },
  {
    id: "3",
    workerId: "W003",
    name: "Priya Patel",
    site: "Site B - Commercial Building",
    date: "2025-04-11",
    checkInTime: "08:30 AM",
    checkOutTime: "05:30 PM",
    status: "Present",
    overtime: "1.5 hours",
  },
  {
    id: "4",
    workerId: "W004",
    name: "Amit Singh",
    site: "Site C - Highway Project",
    date: "2025-04-11",
    checkInTime: "",
    checkOutTime: "",
    status: "Absent",
    overtime: "0 hour",
  },
  {
    id: "5",
    workerId: "W005",
    name: "Neha Gupta",
    site: "Site B - Commercial Building",
    date: "2025-04-11",
    checkInTime: "08:05 AM",
    checkOutTime: "06:00 PM",
    status: "Present",
    overtime: "2 hours",
  },
];

export default function Attendance() {
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Filter attendance data based on search query and selected site
  const filteredAttendance = MOCK_ATTENDANCE_DATA.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.workerId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSite =
      selectedSite === "all" || record.site.includes(selectedSite);
    
    return matchesSearch && matchesSite;
  });

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance Management</h2>
          <p className="text-muted-foreground">
            Track and manage worker attendance across sites
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record New
        </Button>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>
                April 11, 2025 | Total Present: {filteredAttendance.filter(r => r.status === "Present").length} / {filteredAttendance.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row mb-6">
                <div className="flex items-center gap-2 flex-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="date" 
                    placeholder="Select date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex-1">
                  <Select value={selectedSite} onValueChange={setSelectedSite}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sites</SelectItem>
                      {MOCK_SITES.map((site) => (
                        <SelectItem key={site.id} value={site.name}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search workers..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Worker ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Overtime</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAttendance.length > 0 ? (
                      filteredAttendance.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.workerId}</TableCell>
                          <TableCell>{record.name}</TableCell>
                          <TableCell>{record.site}</TableCell>
                          <TableCell>{record.checkInTime || "-"}</TableCell>
                          <TableCell>{record.checkOutTime || "-"}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === "Present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {record.status}
                            </span>
                          </TableCell>
                          <TableCell>{record.overtime}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No attendance records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Report</CardTitle>
              <CardDescription>
                View attendance trends for the current week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground">Weekly attendance chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Summary</CardTitle>
              <CardDescription>
                Monthly overview of worker attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground">Monthly attendance data will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
