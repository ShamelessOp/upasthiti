import { supabase } from "@/integrations/supabase/client";
import { InventoryItem, InventoryTransaction } from "@/models/inventory";
import { toast } from "sonner";

class InventoryService {
  async getAllItems(): Promise<InventoryItem[]> {
    try {
      // For now, return mock data since we don't have inventory table in Supabase
      // In a real implementation, this would fetch from a proper inventory table
      const mockItems: InventoryItem[] = [
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
          siteId: "all",
          siteName: "All Sites",
          lastUpdated: new Date().toISOString(),
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
          siteId: "all",
          siteName: "All Sites",
          lastUpdated: new Date().toISOString(),
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
          siteId: "all",
          siteName: "All Sites",
          lastUpdated: new Date().toISOString(),
        },
      ];

      return mockItems;
    } catch (error) {
      console.error("Failed to fetch inventory items:", error);
      toast.error("Failed to fetch inventory items");
      return [];
    }
  }

  async updateItemQuantity(itemId: string, newQuantity: number): Promise<boolean> {
    try {
      // Mock implementation - in real app this would update the database
      toast.success("Inventory updated successfully");
      return true;
    } catch (error) {
      console.error("Failed to update inventory:", error);
      toast.error("Failed to update inventory");
      return false;
    }
  }

  async addInventoryTransaction(transaction: Partial<InventoryTransaction>): Promise<boolean> {
    try {
      // Mock implementation - in real app this would save to database
      toast.success("Transaction recorded successfully");
      return true;
    } catch (error) {
      console.error("Failed to record transaction:", error);
      toast.error("Failed to record transaction");
      return false;
    }
  }

  async getRecentTransactions(): Promise<InventoryTransaction[]> {
    try {
      // Mock data for recent transactions
      const mockTransactions: InventoryTransaction[] = [
        {
          id: "1",
          itemId: "1",
          itemName: "Cement Bags (50kg)",
          type: "Inward",
          quantity: 50,
          unitPrice: 350,
          totalValue: 17500,
          date: new Date().toISOString().split('T')[0],
          siteId: "site1",
          siteName: "Site A",
          updatedBy: "Current User",
          notes: "Monthly stock replenishment"
        }
      ];

      return mockTransactions;
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      return [];
    }
  }
}

export const inventoryService = new InventoryService();