import { supabase } from "@/integrations/supabase/client";
import { CashTransaction, CashbookFilter, CashbookSummary } from "@/models/cashbook";
import { toast } from "sonner";

class CashbookService {
  async getAllTransactions(filter?: CashbookFilter): Promise<CashTransaction[]> {
    try {
      // Mock implementation with realistic data
      const mockTransactions: CashTransaction[] = [
        {
          id: "1",
          date: new Date().toISOString().split('T')[0],
          siteId: "site1",
          siteName: "Site A - Residential Complex",
          transactionType: "Material Purchase",
          description: "Cement and Steel Bars",
          amount: 45000,
          type: "expense",
          reference: `PO-${Date.now()}`,
          recordedBy: "Current User",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "2",
          date: new Date().toISOString().split('T')[0],
          siteId: "site1",
          siteName: "Site A - Residential Complex",
          transactionType: "Fund Transfer",
          description: "Project fund allocation",
          amount: 200000,
          type: "income",
          reference: `TRF-${Date.now()}`,
          recordedBy: "Current User",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      let filteredTransactions = mockTransactions;

      if (filter) {
        if (filter.siteId && filter.siteId !== "all") {
          filteredTransactions = filteredTransactions.filter(t => t.siteId === filter.siteId);
        }
        if (filter.type) {
          filteredTransactions = filteredTransactions.filter(t => t.type === filter.type);
        }
        if (filter.searchQuery) {
          const query = filter.searchQuery.toLowerCase();
          filteredTransactions = filteredTransactions.filter(t => 
            t.description.toLowerCase().includes(query) ||
            t.reference.toLowerCase().includes(query)
          );
        }
      }

      return filteredTransactions;
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      return [];
    }
  }

  async addTransaction(transaction: Partial<CashTransaction>): Promise<CashTransaction | null> {
    try {
      const newTransaction: CashTransaction = {
        id: `txn-${Date.now()}`,
        date: transaction.date || new Date().toISOString().split('T')[0],
        siteId: transaction.siteId || "",
        siteName: transaction.siteName || "",
        transactionType: transaction.transactionType || "",
        description: transaction.description || "",
        amount: transaction.amount || 0,
        type: transaction.type || "expense",
        reference: transaction.reference || `REF-${Date.now()}`,
        recordedBy: "Current User",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      toast.success("Transaction added successfully");
      return newTransaction;
    } catch (error) {
      console.error("Failed to add transaction:", error);
      toast.error("Failed to add transaction");
      return null;
    }
  }

  async getCashbookSummary(): Promise<CashbookSummary> {
    try {
      const transactions = await this.getAllTransactions();
      
      const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        period: "Current Month"
      };
    } catch (error) {
      console.error("Failed to fetch cashbook summary:", error);
      return {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        period: "Current Month"
      };
    }
  }
}

export const cashbookService = new CashbookService();