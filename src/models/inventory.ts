
// Inventory data models

export interface InventoryItem {
  id: string;
  itemCode: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  reorderLevel: number;
  siteId: string;
  siteName: string;
  lastUpdated: string;
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: "Inward" | "Outward";
  quantity: number;
  unitPrice: number;
  totalValue: number;
  date: string;
  siteId: string;
  siteName: string;
  updatedBy: string;
  notes?: string;
}
