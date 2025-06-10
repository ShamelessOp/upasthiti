import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  CalendarDays, 
  FileBarChart, 
  FileSpreadsheet, 
  FileText, 
  Users, 
  DollarSign, 
  ShoppingBag, 
  FileUp,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import { siteService } from '@/services/siteService';
import { workerService } from '@/services/workerService';
import { attendanceService } from '@/services/attendanceService';
import { Site } from '@/models/site';
import { Worker } from '@/models/worker';
import { AttendanceRecord } from '@/models/attendance';

// Generate random PDF/Excel data blob
const generateReportData = (reportType: string) => {
  // In a real app, this would create actual PDF/Excel content
  // For demo, we'll just create a text file with some data
  let content = `Sample ${reportType} Report Data\n\n`;
  content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
  
  // Add some fake data based on report type
  if (reportType === 'attendance') {
    content += "Worker ID, Name, Date, Status, Check In, Check Out, Overtime\n";
    for (let i = 1; i <= 15; i++) {
      content += `W00${i}, Worker ${i}, 2025-04-${Math.floor(Math.random() * 18) + 1}, Present, 08:${Math.floor(Math.random() * 30)}, 17:${Math.floor(Math.random() * 30)}, ${Math.floor(Math.random() * 3)}\n`;
    }
  } else if (reportType === 'payroll') {
    content += "Worker ID, Name, Hours Worked, Rate, Overtime Hours, Overtime Rate, Deductions, Net Pay\n";
    for (let i = 1; i <= 15; i++) {
      const hours = 8 * (20 + Math.floor(Math.random() * 5));
      const rate = 150 + Math.floor(Math.random() * 100);
      const overtime = Math.floor(Math.random() * 20);
      const overtimeRate = rate * 1.5;
      const deductions = Math.floor((hours * rate + overtime * overtimeRate) * 0.1);
      const netPay = (hours * rate + overtime * overtimeRate) - deductions;
      content += `W00${i}, Worker ${i}, ${hours}, ${rate}, ${overtime}, ${overtimeRate}, ${deductions}, ${netPay}\n`;
    }
  } else {
    // Generic data for other reports
    content += "Field1, Field2, Field3, Field4, Field5\n";
    for (let i = 1; i <= 20; i++) {
      content += `Value${i}, ${Math.floor(Math.random() * 1000)}, ${Math.floor(Math.random() * 500)}, Category${Math.floor(Math.random() * 5)}, ${Math.random() > 0.5 ? 'Yes' : 'No'}\n`;
    }
  }
  
  return new Blob([content], { type: 'text/plain' });
};

export default function Reports() {
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load existing sample data for displaying stats
        const loadedSites = await siteService.getAllSites();
        setSites(loadedSites);
        
        // Get all workers without any filter parameter
        const allWorkers = await workerService.getAllWorkers();
        setWorkers(allWorkers);
        
        // Get attendance records
        const records = await attendanceService.getAttendance();
        setAttendance(records);
        
      } catch (error) {
        console.error("Failed to load sample data:", error);
      }
    };
    
    loadData();
  }, []);
  
  const reportTypes = [
    { 
      id: 'attendance', 
      name: 'Attendance Reports', 
      description: `${attendance.length} records for ${workers.length} workers across ${sites.length} sites`,
      icon: CalendarDays,
      filename: 'attendance_report_apr_2025.pdf' 
    },
    { 
      id: 'payroll', 
      name: 'Payroll Reports', 
      description: `Salary data for ${workers.length} workers totaling ₹${(workers.length * 12000).toLocaleString()}`,
      icon: DollarSign,
      filename: 'payroll_report_apr_2025.xlsx'
    },
    { 
      id: 'inventory', 
      name: 'Inventory Reports', 
      description: '247 items tracked across all sites',
      icon: ShoppingBag,
      filename: 'inventory_status_apr_2025.xlsx'
    },
    { 
      id: 'cashbook', 
      name: 'Financial Reports', 
      description: '₹2,547,800 total cash flow recorded',
      icon: FileBarChart,
      filename: 'financial_summary_q1_2025.pdf'
    },
    { 
      id: 'worker', 
      name: 'Worker Reports', 
      description: `Performance metrics for ${workers.length} workers`,
      icon: Users,
      filename: 'worker_performance_apr_2025.xlsx'
    },
    { 
      id: 'summary', 
      name: 'Summary Reports', 
      description: `${sites.length} sites, ${workers.length} workers, ${attendance.length} attendance records`,
      icon: BarChart3,
      filename: 'business_summary_apr_2025.pdf'
    },
    { 
      id: 'tax', 
      name: 'Tax Reports', 
      description: 'GST and income tax documents for Q1 2025',
      icon: FileText,
      filename: 'tax_compliance_q1_2025.pdf'
    },
    { 
      id: 'custom', 
      name: 'Custom Reports', 
      description: 'Generate reports with custom parameters',
      icon: FileUp,
      filename: 'custom_report_apr_2025.xlsx'
    },
  ];

  const handleGenerateReport = (reportId: string, filename: string) => {
    setGeneratingReport(reportId);
    
    // Simulate report generation delay
    setTimeout(() => {
      // Create data blob for download
      const blob = generateReportData(reportId);
      const url = URL.createObjectURL(blob);
      
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up
      URL.revokeObjectURL(url);
      setGeneratingReport(null);
      
      toast.success(`${filename} downloaded successfully`);
    }, 1500);
  };

  const handleExportAll = () => {
    toast.info("Preparing all reports for download...");
    
    // Simulate a delay for preparing multiple reports
    setTimeout(() => {
      // Create a combined report data
      const blob = new Blob(
        [`Combined Reports Package
Generated on: ${new Date().toLocaleDateString()}

This package contains the following reports:
- Attendance Reports
- Payroll Reports 
- Inventory Reports
- Financial Reports
- Worker Performance Reports
- Business Summary
- Tax Compliance Documents
- Custom Reports

Total Sites: ${sites.length}
Total Workers: ${workers.length}
Total Records: ${attendance.length}
        `], 
        { type: 'text/plain' }
      );
      const url = URL.createObjectURL(blob);
      
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'all_reports_apr_2025.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success("All reports downloaded successfully");
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">
            Generate and download various reports for your business
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportAll}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {reportTypes.map((report) => (
          <Card key={report.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="p-4 pb-0">
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-primary/10 p-2">
                  <report.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{report.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardDescription className="mb-3">{report.description}</CardDescription>
              <Button 
                variant="outline" 
                className="w-full" 
                size="sm"
                onClick={() => handleGenerateReport(report.id, report.filename)}
                disabled={generatingReport === report.id}
              >
                {generatingReport === report.id ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
