
// Cashbook data models

export interface CashTransaction {
  id: string;
  date: string;
  siteId: string;
  siteName: string;
  transactionType: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  reference: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CashbookFilter {
  siteId?: string;
  transactionType?: string;
  startDate?: string;
  endDate?: string;
  type?: "income" | "expense";
  searchQuery?: string;
}

export interface CashbookSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  period: string;
}
