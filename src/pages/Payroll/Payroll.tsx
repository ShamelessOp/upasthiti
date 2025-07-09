import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Download, FileText, FileSpreadsheet, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const MOCK_SITES = [
  { id: "1", name: "Site A - Residential Complex" },
  { id: "2", name: "Site B - Commercial Building" },
  { id: "3", name: "Site C - Highway Project" },
];

const MOCK_PAYROLL_DATA = [
  {
    id: "1",
    workerId: "W001",
    name: "Rajesh Kumar",
    site: "Site A - Residential Complex",
    period: "Apr 01-15, 2025",
    daysWorked: 14,
    overtimeHours: 6,
    basicPay: 14000,
    overtimePay: 1200,
    totalPay: 15200,
    status: "Paid",
    paymentDate: "Apr 16, 2025",
  },
  {
    id: "2",
    workerId: "W002",
    name: "Sunil Sharma",
    site: "Site A - Residential Complex",
    period: "Apr 01-15, 2025",
    daysWorked: 13,
    overtimeHours: 2,
    basicPay: 13000,
    overtimePay: 400,
    totalPay: 13400,
    status: "Paid",
    paymentDate: "Apr 16, 2025",
  },
  {
    id: "3",
    workerId: "W003",
    name: "Priya Patel",
    site: "Site B - Commercial Building",
    period: "Apr 01-15, 2025",
    daysWorked: 15,
    overtimeHours: 8,
    basicPay: 15000,
    overtimePay: 1600,
    totalPay: 16600,
    status: "Paid",
    paymentDate: "Apr 16, 2025",
  },
  {
    id: "4",
    workerId: "W004",
    name: "Amit Singh",
    site: "Site C - Highway Project",
    period: "Apr 01-15, 2025",
    daysWorked: 10,
    overtimeHours: 0,
    basicPay: 10000,
    overtimePay: 0,
    totalPay: 10000,
    status: "Pending",
    paymentDate: "-",
  },
  {
    id: "5",
    workerId: "W005",
    name: "Neha Gupta",
    site: "Site B - Commercial Building",
    period: "Apr 01-15, 2025",
    daysWorked: 12,
    overtimeHours: 5,
    basicPay: 12000,
    overtimePay: 1000,
    totalPay: 13000,
    status: "Paid",
    paymentDate: "Apr 16, 2025",
  },
];

export default function Payroll() {
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("current");

  const filteredPayroll = MOCK_PAYROLL_DATA.filter((record) => {
    const matchesSearch =
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.workerId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSite =
      selectedSite === "all" || record.site.includes(selectedSite);
    
    return matchesSearch && matchesSite;
  });

  const totalWorkers = filteredPayroll.length;
  const totalPaid = filteredPayroll.filter(r => r.status === "Paid").length;
  const totalAmount = filteredPayroll.reduce((sum, record) => sum + record.totalPay, 0);

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payroll Management</h2>
          <p className="text-muted-foreground">
            Process and view payment details for workers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Process Payroll
          </Button>
        </div>
      </div>

      <Tabs defaultValue="payroll" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payroll">Payroll Processing</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="reports">Payroll Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="payroll" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalWorkers}</div>
                <p className="text-xs text-muted-foreground">
                  Current payroll period
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payments Processed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPaid} / {totalWorkers}</div>
                <p className="text-xs text-muted-foreground">
                  {((totalPaid / totalWorkers) * 100).toFixed(1)}% completed
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  For current period
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Payroll Details</CardTitle>
              <CardDescription>
                Period: April 01-15, 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row mb-6">
                <div className="flex-1">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Apr 01-15, 2025</SelectItem>
                      <SelectItem value="previous">Mar 16-31, 2025</SelectItem>
                      <SelectItem value="earlier">Mar 01-15, 2025</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <TableHead className="text-right">Days</TableHead>
                      <TableHead className="text-right">OT Hours</TableHead>
                      <TableHead className="text-right">Basic (₹)</TableHead>
                      <TableHead className="text-right">OT Pay (₹)</TableHead>
                      <TableHead className="text-right">Total (₹)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayroll.length > 0 ? (
                      filteredPayroll.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.workerId}</TableCell>
                          <TableCell>{record.name}</TableCell>
                          <TableCell>{record.site}</TableCell>
                          <TableCell className="text-right">{record.daysWorked}</TableCell>
                          <TableCell className="text-right">{record.overtimeHours}</TableCell>
                          <TableCell className="text-right">{record.basicPay.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{record.overtimePay.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium">{record.totalPay.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={record.status === "Paid" ? "default" : "secondary"}>
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                              <span className="sr-only">Generate Payslip</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-4">
                          No payroll records found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredPayroll.length} of {MOCK_PAYROLL_DATA.length} records
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View all processed payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground">Payment history will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Reports</CardTitle>
              <CardDescription>
                Generate and view reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground">Payroll reports will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
