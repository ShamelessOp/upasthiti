
import React, { useState } from 'react';
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

export default function Reports() {
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  
  const reportTypes = [
    { 
      id: 'attendance', 
      name: 'Attendance Reports', 
      description: 'Daily, weekly and monthly attendance records',
      icon: CalendarDays,
      filename: 'attendance_report_apr_2025.pdf' 
    },
    { 
      id: 'payroll', 
      name: 'Payroll Reports', 
      description: 'Salary, wages and payment summaries',
      icon: DollarSign,
      filename: 'payroll_report_apr_2025.xlsx'
    },
    { 
      id: 'inventory', 
      name: 'Inventory Reports', 
      description: 'Stock levels, usage and reordering reports',
      icon: ShoppingBag,
      filename: 'inventory_status_apr_2025.xlsx'
    },
    { 
      id: 'cashbook', 
      name: 'Financial Reports', 
      description: 'Income, expenses and cash flow statements',
      icon: FileBarChart,
      filename: 'financial_summary_q1_2025.pdf'
    },
    { 
      id: 'worker', 
      name: 'Worker Reports', 
      description: 'Worker performance and activity reports',
      icon: Users,
      filename: 'worker_performance_apr_2025.xlsx'
    },
    { 
      id: 'summary', 
      name: 'Summary Reports', 
      description: 'Overall business performance metrics',
      icon: BarChart3,
      filename: 'business_summary_apr_2025.pdf'
    },
    { 
      id: 'tax', 
      name: 'Tax Reports', 
      description: 'GST, income tax and compliance documents',
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
      // Create a dummy blob for download
      const blob = new Blob(['Sample report data for ' + reportId], { type: 'text/plain' });
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
      // Create a single dummy blob for all reports
      const blob = new Blob(['Combined reports data'], { type: 'text/plain' });
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
