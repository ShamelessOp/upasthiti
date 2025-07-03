import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Plus, Search, TrendingDown, TrendingUp, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { inventoryService } from "@/services/inventoryService";
import { InventoryItem } from "@/models/inventory";
import { AddInventoryDialog } from "./components/AddInventoryDialog";
import { toast } from "sonner";

const MOCK_CATEGORIES = [
  { id: "1", name: "Construction Materials" },
  { id: "2", name: "Tools & Equipment" },
  { id: "3", name: "Safety Gear" },
  { id: "4", name: "Electrical Supplies" },
];

export default function Inventory() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadInventoryItems();
  }, []);

  const loadInventoryItems = async () => {
    setIsLoading(true);
    try {
      const items = await inventoryService.getAllItems();
      setInventoryItems(items);
    } catch (error) {
      toast.error("Failed to load inventory items");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter inventory data based on search query and selected category
  const filteredInventory = inventoryItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get low stock items
  const lowStockItems = inventoryItems.filter(
    (item) => item.quantity <= item.reorderLevel
  );

  // Calculate inventory summary
  const totalItems = filteredInventory.length;
  const totalValue = filteredInventory.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockCount = lowStockItems.length;

  const handleStockUpdate = async (itemId: string, type: 'in' | 'out', quantity: number) => {
    try {
      const item = inventoryItems.find(i => i.id === itemId);
      if (!item) return;

      const newQuantity = type === 'in' ? item.quantity + quantity : item.quantity - quantity;
      
      if (newQuantity < 0) {
        toast.error("Cannot reduce stock below zero");
        return;
      }

      await inventoryService.updateItemQuantity(itemId, newQuantity);
      
      // Update local state
      setInventoryItems(items => 
        items.map(i => 
          i.id === itemId 
            ? { ...i, quantity: newQuantity, totalValue: newQuantity * i.unitPrice }
            : i
        )
      );

      // Record transaction
      await inventoryService.addInventoryTransaction({
        itemId,
        itemName: item.name,
        type: type === 'in' ? 'Inward' : 'Outward',
        quantity,
        unitPrice: item.unitPrice,
        totalValue: quantity * item.unitPrice,
        date: new Date().toISOString().split('T')[0],
        siteId: item.siteId,
        siteName: item.siteName,
        updatedBy: 'Current User'
      });

      toast.success(`Stock ${type === 'in' ? 'added' : 'removed'} successfully`);
    } catch (error) {
      toast.error("Failed to update stock");
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">
            Track and manage construction materials and equipment
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              In {MOCK_CATEGORIES.length} categories
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
            <AlertTriangle className="h-4 w-4 text-destructive" />
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
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-4">
                          <div className="flex justify-center">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredInventory.length > 0 ? (
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
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  const quantity = prompt("Enter quantity to add:");
                                  if (quantity && !isNaN(Number(quantity))) {
                                    handleStockUpdate(item.id, 'in', Number(quantity));
                                  }
                                }}
                              >
                                <TrendingUp className="h-4 w-4" />
                                <span className="sr-only">Stock In</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  const quantity = prompt("Enter quantity to remove:");
                                  if (quantity && !isNaN(Number(quantity))) {
                                    handleStockUpdate(item.id, 'out', Number(quantity));
                                  }
                                }}
                              >
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
                Showing {filteredInventory.length} of {inventoryItems.length} items
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
              <div className="text-center py-6">
                <p className="text-muted-foreground">Recent transactions will be displayed here</p>
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
                          <Button 
                            size="sm"
                            onClick={() => {
                              const quantity = prompt("Enter quantity to restock:");
                              if (quantity && !isNaN(Number(quantity))) {
                                handleStockUpdate(item.id, 'in', Number(quantity));
                              }
                            }}
                          >
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

      <AddInventoryDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onItemAdded={loadInventoryItems}
      />
    </div>
  );
}