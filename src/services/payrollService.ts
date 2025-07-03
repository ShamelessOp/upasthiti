import { supabase } from "@/integrations/supabase/client";
import { PayrollRecord, PayrollFilter, PayrollSummary } from "@/models/payroll";
import { toast } from "sonner";
import { workerService } from "./workerService";
import { attendanceService } from "./attendanceService";

class PayrollService {
  async generatePayroll(siteId: string, startDate: string, endDate: string): Promise<PayrollRecord[]> {
    try {
      // Get workers for the site
      const workers = await workerService.getWorkersBySiteId(siteId);
      
      // Get attendance records for the period
      const attendance = await attendanceService.getAttendance({
        siteId,
        startDate,
        endDate
      });

      const payrollRecords: PayrollRecord[] = [];

      for (const worker of workers) {
        // Calculate days worked and overtime
        const workerAttendance = attendance.filter(a => a.workerId === worker.worker_id);
        const daysWorked = workerAttendance.filter(a => a.status === "Present").length;
        const overtimeHours = workerAttendance.reduce((total, a) => total + (a.overtimeHours || 0), 0);

        // Calculate pay
        const basicPay = daysWorked * worker.daily_wage;
        const overtimePay = overtimeHours * (worker.daily_wage / 8) * 1.5; // 1.5x rate for overtime
        const totalPay = basicPay + overtimePay;

        const payrollRecord: PayrollRecord = {
          id: `payroll-${worker.id}-${Date.now()}`,
          workerId: worker.worker_id,
          workerName: worker.name,
          siteId: worker.site_id,
          siteName: "Site Name", // Would be fetched from site service
          period: `${startDate} to ${endDate}`,
          startDate,
          endDate,
          daysWorked,
          overtimeHours,
          basicPay,
          overtimePay,
          deductions: 0,
          totalPay,
          status: "Pending",
          paymentDate: null,
          processedBy: "System",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        payrollRecords.push(payrollRecord);
      }

      toast.success(`Payroll generated for ${payrollRecords.length} workers`);
      return payrollRecords;
    } catch (error) {
      console.error("Failed to generate payroll:", error);
      toast.error("Failed to generate payroll");
      return [];
    }
  }

  async getPayrollRecords(filter?: PayrollFilter): Promise<PayrollRecord[]> {
    try {
      // Mock implementation - in real app this would fetch from database
      const mockRecords: PayrollRecord[] = [
        {
          id: "1",
          workerId: "W001",
          workerName: "Rajesh Kumar",
          siteId: "site1",
          siteName: "Site A - Residential Complex",
          period: "Apr 01-15, 2025",
          startDate: "2025-04-01",
          endDate: "2025-04-15",
          daysWorked: 14,
          overtimeHours: 6,
          basicPay: 14000,
          overtimePay: 1200,
          deductions: 0,
          totalPay: 15200,
          status: "Paid",
          paymentDate: "2025-04-16",
          processedBy: "Admin",
          createdAt: "2025-04-16T00:00:00Z",
          updatedAt: "2025-04-16T00:00:00Z"
        }
      ];

      return mockRecords;
    } catch (error) {
      console.error("Failed to fetch payroll records:", error);
      return [];
    }
  }

  async updatePayrollStatus(id: string, status: "Pending" | "Paid" | "Cancelled"): Promise<boolean> {
    try {
      // Mock implementation
      toast.success(`Payroll status updated to ${status}`);
      return true;
    } catch (error) {
      console.error("Failed to update payroll status:", error);
      toast.error("Failed to update payroll status");
      return false;
    }
  }

  async getPayrollSummary(): Promise<PayrollSummary> {
    try {
      // Mock implementation
      return {
        totalWorkers: 25,
        paidWorkers: 20,
        pendingWorkers: 5,
        totalAmount: 375000,
        totalBasicPay: 350000,
        totalOvertimePay: 25000,
        totalDeductions: 0
      };
    } catch (error) {
      console.error("Failed to fetch payroll summary:", error);
      return {
        totalWorkers: 0,
        paidWorkers: 0,
        pendingWorkers: 0,
        totalAmount: 0,
        totalBasicPay: 0,
        totalOvertimePay: 0,
        totalDeductions: 0
      };
    }
  }
}

export const payrollService = new PayrollService();