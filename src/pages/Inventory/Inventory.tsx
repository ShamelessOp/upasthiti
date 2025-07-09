
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Plus, Search, TrendingDown, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock data for demonstration purposes
const MOCK_CATEGORIES = [
  { id: "1", name: "Construction Materials" },
  { id: "2", name: "Tools & Equipment" },
  { id: "3", name: "Safety Gear" },
  { id: "4", name: "Electrical Supplies" },
];

const MOCK_INVENTORY_DATA = [
  {
    id: "1",
    itemCode: "CM001",
    name: "Cement Bags (50kg)",
    category: "Construction Materials",
    quantity: 150,
    unit: "Bags",
    unitPrice: 350,
    totalValue: 52500,
    reorderLevel: 30,
    lastUpdated: "Apr 10, 2025",
  },
  {
    id: "2",
    itemCode: "CM002",
    name: "Sand",
    category: "Construction Materials",
    quantity: 25,
    unit: "Tons",
    unitPrice: 1200,
    totalValue: 30000,
    reorderLevel: 10,
    lastUpdated: "Apr 09, 2025",
  },
  {
    id: "3",
    itemCode: "CM003",
    name: "Steel Bars (10mm)",
    category: "Construction Materials",
    quantity: 500,
    unit: "Pcs",
    unitPrice: 850,
    totalValue: 425000,
    reorderLevel: 100,
    lastUpdated: "Apr 05, 2025",
  },
  {
    id: "4",
    itemCode: "TE001",
    name: "Concrete Mixer",
    category: "Tools & Equipment",
    quantity: 5,
    unit: "Pcs",
    unitPrice: 25000,
    totalValue: 125000,
    reorderLevel: 2,
    lastUpdated: "Mar 28, 2025",
  },
  {
    id: "5",
    itemCode: "SG001",
    name: "Safety Helmets",
    category: "Safety Gear",
    quantity: 25,
    unit: "Pcs",
    unitPrice: 450,
    totalValue: 11250,
    reorderLevel: 20,
    lastUpdated: "Apr 08, 2025",
  },
  {
    id: "6",
    itemCode: "ES001",
    name: "Electrical Wires (1.5mm)",
    category: "Electrical Supplies",
    quantity: 8,
    unit: "Rolls",
    unitPrice: 2200,
    totalValue: 17600,
    reorderLevel: 5,
    lastUpdated: "Apr 07, 2025",
  },
];

const MOCK_RECENT_TRANSACTIONS = [
  {
    id: "1",
    date: "Apr 10, 2025",
    itemName: "Cement Bags (50kg)",
    type: "Inward",
    quantity: 50,
    site: "Site A - Residential Complex",
    updatedBy: "Rajesh Kumar",
  },
  {
    id: "2",
    date: "Apr 09, 2025",
    itemName: "Safety Helmets",
    type: "Outward",
    quantity: 10,
    site: "Site B - Commercial Building",
    updatedBy: "Sunil Sharma",
  },
  {
    id: "3",
    date: "Apr 08, 2025",
    itemName: "Sand",
    type: "Inward",
    quantity: 5,
    site: "Site C - Highway Project",
    updatedBy: "Amit Singh",
  },
  {
    id: "4",
    date: "Apr 07, 2025",
    itemName: "Electrical Wires (1.5mm)",
    type: "Outward",
    quantity: 2,
    site: "Site A - Residential Complex",
    updatedBy: "Priya Patel",
  },
];

export default function Inventory() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter inventory data based on search query and selected category
  const filteredInventory = MOCK_INVENTORY_DATA.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get low stock items
  const lowStockItems = MOCK_INVENTORY_DATA.filter(
    (item) => item.quantity <= item.reorderLevel
  );

  // Calculate inventory summary
  const totalItems = filteredInventory.length;
  const totalValue = filteredInventory.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockCount = lowStockItems.length;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">
            Track and manage construction materials and equipment
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              In {Object.keys(MOCK_CATEGORIES).length} categories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockCount} items</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory List</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
              <CardDescription>
                Manage and track inventory items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row mb-6">
                <div className="flex-1">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {MOCK_CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search items..." 
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
                      <TableHead>Item Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead className="text-right">Unit Price (₹)</TableHead>
                      <TableHead className="text-right">Total Value (₹)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.length > 0 ? (
                      filteredInventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.itemCode}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell className="text-right">{item.unitPrice.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{item.totalValue.toLocaleString()}</TableCell>
                          <TableCell>
                            {item.quantity <= item.reorderLevel ? (
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Low Stock
                              </Badge>
                            ) : (
                              <Badge variant="default">In Stock</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm">
                                <TrendingUp className="h-4 w-4" />
                                <span className="sr-only">Stock In</span>
                              </Button>
                              <Button variant="ghost" size="sm">
                                <TrendingDown className="h-4 w-4" />
                                <span className="sr-only">Stock Out</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
                          No inventory items found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredInventory.length} of {MOCK_INVENTORY_DATA.length} items
              </div>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                Stock movement in the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Updated By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_RECENT_TRANSACTIONS.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell className="font-medium">{transaction.itemName}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={transaction.type === "Inward" ? "default" : "secondary"}
                            className="flex items-center gap-1 w-fit"
                          >
                            {transaction.type === "Inward" ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {transaction.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{transaction.quantity}</TableCell>
                        <TableCell>{transaction.site}</TableCell>
                        <TableCell>{transaction.updatedBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>
                Items that need to be restocked soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockItems.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {lowStockItems.map((item) => (
                    <Card key={item.id}>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{item.name}</CardTitle>
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Low Stock
                          </Badge>
                        </div>
                        <CardDescription>{item.itemCode} | {item.category}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm">Current: {item.quantity} {item.unit}</span>
                            <span className="text-sm">Reorder Level: {item.reorderLevel} {item.unit}</span>
                          </div>
                          <Progress value={(item.quantity / item.reorderLevel) * 100} className="h-2" />
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button size="sm">
                            <Plus className="mr-1 h-4 w-4" />
                            Restock
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p>No low stock items at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
