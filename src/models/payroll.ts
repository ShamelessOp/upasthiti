
// Payroll data models

export interface PayrollRecord {
  id: string;
  workerId: string;
  workerName: string;
  siteId: string;
  siteName: string;
  period: string;
  startDate: string;
  endDate: string;
  daysWorked: number;
  overtimeHours: number;
  basicPay: number;
  overtimePay: number;
  deductions: number;
  totalPay: number;
  status: "Pending" | "Paid" | "Cancelled";
  paymentDate: string | null;
  processedBy: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayrollFilter {
  siteId?: string;
  period?: string;
  status?: "Pending" | "Paid" | "Cancelled";
  searchQuery?: string;
}

export interface PayrollSummary {
  totalWorkers: number;
  paidWorkers: number;
  pendingWorkers: number;
  totalAmount: number;
  totalBasicPay: number;
  totalOvertimePay: number;
  totalDeductions: number;
}
