
import React from 'react';
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
  FileUp 
} from 'lucide-react';

export default function Reports() {
  const reportTypes = [
    { 
      id: 'attendance', 
      name: 'Attendance Reports', 
      description: 'Daily, weekly and monthly attendance records',
      icon: CalendarDays 
    },
    { 
      id: 'payroll', 
      name: 'Payroll Reports', 
      description: 'Salary, wages and payment summaries',
      icon: DollarSign 
    },
    { 
      id: 'inventory', 
      name: 'Inventory Reports', 
      description: 'Stock levels, usage and reordering reports',
      icon: ShoppingBag 
    },
    { 
      id: 'cashbook', 
      name: 'Financial Reports', 
      description: 'Income, expenses and cash flow statements',
      icon: FileBarChart 
    },
    { 
      id: 'worker', 
      name: 'Worker Reports', 
      description: 'Worker performance and activity reports',
      icon: Users 
    },
    { 
      id: 'summary', 
      name: 'Summary Reports', 
      description: 'Overall business performance metrics',
      icon: BarChart3 
    },
    { 
      id: 'tax', 
      name: 'Tax Reports', 
      description: 'GST, income tax and compliance documents',
      icon: FileText 
    },
    { 
      id: 'custom', 
      name: 'Custom Reports', 
      description: 'Generate reports with custom parameters',
      icon: FileUp 
    },
  ];

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
          <Button variant="outline">
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
              <Button variant="outline" className="w-full" size="sm">
                Generate Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
