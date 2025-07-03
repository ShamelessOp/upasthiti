import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp, Calendar, Download, Plus, Search, TrendingDown, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cashbookService } from "@/services/cashbookService";
import { siteService } from "@/services/siteService";
import { CashTransaction, CashbookSummary } from "@/models/cashbook";
import { Site } from "@/models/site";
import { AddTransactionDialog } from "./components/AddTransactionDialog";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

export default function Cashbook() {
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [summary, setSummary] = useState<CashbookSummary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    period: "Current Month"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [selectedSite, selectedTransactionType, searchQuery, selectedDate]);

  const loadData = async () => {
    try {
      const [siteData, summaryData] = await Promise.all([
        siteService.getAllSites(),
        cashbookService.getCashbookSummary()
      ]);
      
      setSites(siteData);
      setSummary(summaryData);
    } catch (error) {
      toast.error("Failed to load data");
    }
  };

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const filter = {
        siteId: selectedSite !== "all" ? selectedSite : undefined,
        transactionType: selectedTransactionType !== "all" ? selectedTransactionType : undefined,
        searchQuery: searchQuery || undefined,
        startDate: selectedDate || undefined
      };

      const data = await cashbookService.getAllTransactions(filter);
      setTransactions(data);
      
      // Update summary based on filtered data
      const totalIncome = data.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
      const totalExpense = data.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
      
      setSummary(prev => ({
        ...prev,
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense
      }));
    } catch (error) {
      toast.error("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportToExcel = () => {
    const data = transactions.map(transaction => ({
      'Date': transaction.date,
      'Site': transaction.siteName,
      'Transaction Type': transaction.transactionType,
      'Description': transaction.description,
      'Reference': transaction.reference,
      'Amount': transaction.amount,
      'Type': transaction.type,
      'Recorded By': transaction.recordedBy
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Cashbook');
    XLSX.writeFile(wb, `cashbook_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Cashbook data exported successfully');
  };

  const transactionTypes = [
    "Material Purchase",
    "Wages Payment", 
    "Equipment Rental",
    "Transport",
    "Petty Cash",
    "Fund Transfer",
    "Advance Payment",
    "Project Payment"
  ];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cashbook Management</h2>
          <p className="text-muted-foreground">
            Track cash inflows and outflows across sites
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportToExcel}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{summary.totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summary.period}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{summary.totalExpense.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {summary.period}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              ₹{summary.balance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Net position
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Transactions</CardTitle>
              <CardDescription>
                All cash movements for the selected period
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
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Select value={selectedTransactionType} onValueChange={setSelectedTransactionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {transactionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search transactions..." 
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
                      <TableHead>Date</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Transaction Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead className="text-right">Amount (₹)</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Recorded By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          <div className="flex justify-center">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : transactions.length > 0 ? (
                      transactions.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell>{record.siteName}</TableCell>
                          <TableCell>{record.transactionType}</TableCell>
                          <TableCell>{record.description}</TableCell>
                          <TableCell className="font-mono">{record.reference}</TableCell>
                          <TableCell className="text-right font-medium">
                            {record.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {record.type === "income" ? (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100" variant="outline">
                                Income
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-100" variant="outline">
                                Expense
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{record.recordedBy}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {transactions.length} transactions
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cashbook Reports</CardTitle>
              <CardDescription>
                Generate and view detailed financial reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground">Cashbook reports will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Analysis</CardTitle>
              <CardDescription>
                Visualize cash movement trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground">Cash flow charts will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddTransactionDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onTransactionAdded={() => {
          loadTransactions();
          loadData();
        }}
      />
    </div>
  );
}