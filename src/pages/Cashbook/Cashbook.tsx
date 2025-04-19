import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownUp, Calendar, Download, Plus, Search, TrendingDown, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration purposes
const MOCK_SITES = [
  { id: "1", name: "Site A - Residential Complex" },
  { id: "2", name: "Site B - Commercial Building" },
  { id: "3", name: "Site C - Highway Project" },
];

const MOCK_TRANSACTION_TYPES = [
  { id: "1", name: "Material Purchase", type: "expense" },
  { id: "2", name: "Wages Payment", type: "expense" },
  { id: "3", name: "Petty Cash", type: "expense" },
  { id: "4", name: "Fund Transfer", type: "income" },
  { id: "5", name: "Advance Payment", type: "income" },
];

// Updated mock data with more entries
const MOCK_CASHBOOK_DATA = [
  {
    id: "1",
    date: "Apr 18, 2025",
    site: "Site A - Residential Complex",
    transactionType: "Material Purchase",
    description: "Cement and Steel Bars",
    amount: 45000,
    type: "expense",
    reference: "PO-2025-0045",
    recordedBy: "Rajesh Kumar",
  },
  {
    id: "2",
    date: "Apr 18, 2025",
    site: "Site B - Commercial Building",
    transactionType: "Wages Payment",
    description: "Weekly wages for 25 workers",
    amount: 87500,
    type: "expense",
    reference: "PAY-2025-0078",
    recordedBy: "Sunil Sharma",
  },
  {
    id: "3",
    date: "Apr 17, 2025",
    site: "Site C - Highway Project",
    transactionType: "Fund Transfer",
    description: "Project fund allocation",
    amount: 200000,
    type: "income",
    reference: "TRF-2025-0023",
    recordedBy: "Priya Patel",
  },
  {
    id: "4",
    date: "Apr 17, 2025",
    site: "Site A - Residential Complex",
    transactionType: "Petty Cash",
    description: "Miscellaneous site expenses",
    amount: 5000,
    type: "expense",
    reference: "PC-2025-0056",
    recordedBy: "Amit Singh",
  },
  {
    id: "5",
    date: "Apr 16, 2025",
    site: "Site B - Commercial Building",
    transactionType: "Advance Payment",
    description: "Client advance for Phase 2",
    amount: 500000,
    type: "income",
    reference: "ADV-2025-0012",
    recordedBy: "Neha Gupta",
  },
  {
    id: "6",
    date: "Apr 16, 2025",
    site: "Site C - Highway Project",
    transactionType: "Equipment Rental",
    description: "Excavator rental for 1 week",
    amount: 35000,
    type: "expense",
    reference: "RENT-2025-0067",
    recordedBy: "Vikram Singh",
  },
  {
    id: "7",
    date: "Apr 15, 2025",
    site: "Site A - Residential Complex",
    transactionType: "Material Purchase",
    description: "Electrical wiring and fixtures",
    amount: 28500,
    type: "expense",
    reference: "PO-2025-0046",
    recordedBy: "Rajesh Kumar",
  },
  {
    id: "8",
    date: "Apr 15, 2025",
    site: "Site B - Commercial Building",
    transactionType: "Consultant Fee",
    description: "Structural engineer consultation",
    amount: 15000,
    type: "expense",
    reference: "CONS-2025-0034",
    recordedBy: "Sunil Sharma",
  },
  {
    id: "9",
    date: "Apr 14, 2025",
    site: "Site C - Highway Project",
    transactionType: "Fund Transfer",
    description: "Additional project funding",
    amount: 300000,
    type: "income",
    reference: "TRF-2025-0024",
    recordedBy: "Priya Patel",
  },
  {
    id: "10",
    date: "Apr 14, 2025",
    site: "Site A - Residential Complex",
    transactionType: "Material Purchase",
    description: "Plumbing materials",
    amount: 18500,
    type: "expense",
    reference: "PO-2025-0047",
    recordedBy: "Amit Singh",
  },
  {
    id: "11",
    date: "Apr 13, 2025",
    site: "Site B - Commercial Building",
    transactionType: "Wages Payment",
    description: "Overtime payment for 15 workers",
    amount: 22500,
    type: "expense",
    reference: "PAY-2025-0079",
    recordedBy: "Neha Gupta",
  },
  {
    id: "12",
    date: "Apr 13, 2025",
    site: "Site C - Highway Project",
    transactionType: "Equipment Purchase",
    description: "Concrete mixer machine",
    amount: 85000,
    type: "expense",
    reference: "PO-2025-0048",
    recordedBy: "Vikram Singh",
  },
  {
    id: "13",
    date: "Apr 12, 2025",
    site: "Site A - Residential Complex",
    transactionType: "Advance Payment",
    description: "Client milestone payment",
    amount: 750000,
    type: "income",
    reference: "ADV-2025-0013",
    recordedBy: "Rajesh Kumar",
  },
  {
    id: "14",
    date: "Apr 12, 2025",
    site: "Site B - Commercial Building",
    transactionType: "Transport",
    description: "Material transportation charges",
    amount: 12000,
    type: "expense",
    reference: "TR-2025-0089",
    recordedBy: "Sunil Sharma",
  },
  {
    id: "15",
    date: "Apr 11, 2025",
    site: "Site C - Highway Project",
    transactionType: "Material Purchase",
    description: "Bitumen and aggregates",
    amount: 125000,
    type: "expense",
    reference: "PO-2025-0049",
    recordedBy: "Priya Patel",
  },
];

export default function Cashbook() {
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Filter cashbook data based on search query, selected site, and transaction type
  const filteredCashbook = MOCK_CASHBOOK_DATA.filter((record) => {
    const matchesSearch =
      record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSite =
      selectedSite === "all" || record.site === selectedSite;
    
    const matchesTransactionType =
      selectedTransactionType === "all" || record.transactionType === selectedTransactionType;
    
    return matchesSearch && matchesSite && matchesTransactionType;
  });

  // Calculate summary values
  const totalIncome = filteredCashbook
    .filter((record) => record.type === "income")
    .reduce((sum, record) => sum + record.amount, 0);
  
  const totalExpense = filteredCashbook
    .filter((record) => record.type === "expense")
    .reduce((sum, record) => sum + record.amount, 0);
  
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cashbook Management</h2>
          <p className="text-muted-foreground">
            Track cash inflows and outflows across sites
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{totalExpense.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              ₹{balance.toLocaleString()}
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
                All cash movements for April 2025
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
                <div className="flex-1">
                  <Select value={selectedTransactionType} onValueChange={setSelectedTransactionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {MOCK_TRANSACTION_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCashbook.length > 0 ? (
                      filteredCashbook.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.site}</TableCell>
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
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
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
                Showing {filteredCashbook.length} of {MOCK_CASHBOOK_DATA.length} transactions
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
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
    </div>
  );
}
