import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Download, FileText, FileSpreadsheet, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { payrollService } from "@/services/payrollService";
import { siteService } from "@/services/siteService";
import { PayrollRecord, PayrollSummary } from "@/models/payroll";
import { Site } from "@/models/site";
import { PayrollGenerationDialog } from "./components/PayrollGenerationDialog";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

export default function Payroll() {
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [summary, setSummary] = useState<PayrollSummary>({
    totalWorkers: 0,
    paidWorkers: 0,
    pendingWorkers: 0,
    totalAmount: 0,
    totalBasicPay: 0,
    totalOvertimePay: 0,
    totalDeductions: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadPayrollRecords();
  }, [selectedSite, searchQuery, selectedPeriod]);

  const loadData = async () => {
    try {
      const [siteData, summaryData] = await Promise.all([
        siteService.getAllSites(),
        payrollService.getPayrollSummary()
      ]);
      
      setSites(siteData);
      setSummary(summaryData);
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const loadPayrollRecords = async () => {
    setIsLoading(true);
    try {
      const filter = {
        siteId: selectedSite !== "all" ? selectedSite : undefined,
        searchQuery: searchQuery || undefined
      };

      const records = await payrollService.getPayrollRecords(filter);
      setPayrollRecords(records);
    } catch (error) {
      toast.error("Failed to load payroll records");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportToExcel = () => {
    const data = payrollRecords.map(record => ({
      'Worker ID': record.workerId,
      'Worker Name': record.workerName,
      'Site': record.siteName,
      'Period': record.period,
      'Days Worked': record.daysWorked,
      'Overtime Hours': record.overtimeHours,
      'Basic Pay': record.basicPay,
      'Overtime Pay': record.overtimePay,
      'Deductions': record.deductions,
      'Total Pay': record.totalPay,
      'Status': record.status,
      'Payment Date': record.paymentDate || 'Pending'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payroll');
    XLSX.writeFile(wb, `payroll_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Payroll data exported successfully');
  };

  const handleUpdatePayrollStatus = async (id: string, status: "Pending" | "Paid" | "Cancelled") => {
    try {
      await payrollService.updatePayrollStatus(id, status);
      loadPayrollRecords();
      loadData(); // Refresh summary
    } catch (error) {
      toast.error("Failed to update payroll status");
    }
  };

  const filteredPayroll = payrollRecords.filter((record) => {
    const matchesSearch =
      record.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.workerId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSite =
      selectedSite === "all" || record.siteId === selectedSite;
    
    return matchesSearch && matchesSite;
  });

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
          <Button variant="outline" onClick={handleExportToExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button onClick={() => setShowGenerateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Generate Payroll
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
                <div className="text-2xl font-bold">{summary.totalWorkers}</div>
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
                <div className="text-2xl font-bold">{summary.paidWorkers} / {summary.totalWorkers}</div>
                <p className="text-xs text-muted-foreground">
                  {summary.totalWorkers > 0 ? ((summary.paidWorkers / summary.totalWorkers) * 100).toFixed(1) : 0}% completed
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{summary.totalAmount.toLocaleString()}</div>
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
                Current payroll period records
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
                      <SelectItem value="current">Current Period</SelectItem>
                      <SelectItem value="previous">Previous Period</SelectItem>
                      <SelectItem value="earlier">Earlier Periods</SelectItem>
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
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
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
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-4">
                          <div className="flex justify-center">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredPayroll.length > 0 ? (
                      filteredPayroll.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.workerId}</TableCell>
                          <TableCell>{record.workerName}</TableCell>
                          <TableCell>{record.siteName}</TableCell>
                          <TableCell className="text-right">{record.daysWorked}</TableCell>
                          <TableCell className="text-right">{record.overtimeHours}</TableCell>
                          <TableCell className="text-right">{record.basicPay.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{record.overtimePay.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium">{record.totalPay.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={
                              record.status === "Paid" ? "default" : 
                              record.status === "Pending" ? "secondary" : 
                              "destructive"
                            }>
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              {record.status === "Pending" && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleUpdatePayrollStatus(record.id, "Paid")}
                                >
                                  Mark Paid
                                </Button>
                              )}
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">Generate Payslip</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-4">
                          No payroll records found. Generate payroll to get started.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredPayroll.length} records
              </div>
              <Button variant="outline" size="sm" onClick={handleExportToExcel}>
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

      <PayrollGenerationDialog
        open={showGenerateDialog}
        onOpenChange={setShowGenerateDialog}
        onPayrollGenerated={() => {
          loadPayrollRecords();
          loadData();
        }}
      />
    </div>
  );
}