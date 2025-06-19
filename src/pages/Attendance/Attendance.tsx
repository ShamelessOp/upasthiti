import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileSpreadsheet, Search, UserMinus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AttendanceFilter, AttendanceRecord } from "@/models/attendance";
import { attendanceService } from "@/services/attendanceService";
import { siteService } from "@/services/siteService";
import { workerService } from "@/services/workerService";
import { Site } from "@/models/site";
import { Worker } from "@/models/worker";
import { toast } from "sonner";
import { AddWorkerDialog } from "./components/AddWorkerDialog";
import { useRealtimeData } from "@/hooks/useRealtimeData";
import * as XLSX from 'xlsx';

export default function Attendance() {
  const [sites, setSites] = useState<Site[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [presentCount, setPresentCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [deletingWorkerId, setDeletingWorkerId] = useState<string | null>(null);

  // Set up realtime subscriptions for workers and attendance
  useRealtimeData('workers', ['workers'], ['INSERT', 'UPDATE', 'DELETE']);
  useRealtimeData('attendance', ['attendance'], ['INSERT', 'UPDATE', 'DELETE']);

  useEffect(() => {
    loadSites();
    loadAttendanceRecords();
  }, []);

  const loadSites = async () => {
    try {
      const siteData = await siteService.getAllSites();
      setSites(siteData);
    } catch (error) {
      console.error("Failed to load sites:", error);
      toast.error("Failed to load sites");
    }
  };

  useEffect(() => {
    loadWorkers();
  }, [selectedSite]);

  const loadWorkers = async () => {
    try {
      const allWorkers = await workerService.getAllWorkers();
      const filteredWorkers = selectedSite !== "all" 
        ? allWorkers.filter(worker => worker.site_id === selectedSite)
        : allWorkers;
      setWorkers(filteredWorkers);
      
      // Auto-create attendance records for workers if they don't exist
      await createMissingAttendanceRecords(filteredWorkers);
    } catch (error) {
      console.error("Failed to load workers:", error);
      toast.error("Failed to load workers");
    }
  };

  const createMissingAttendanceRecords = async (workersList: Worker[]) => {
    try {
      const existingAttendance = await attendanceService.getAttendance({
        date: selectedDate,
        siteId: selectedSite !== "all" ? selectedSite : undefined
      });
      
      const existingWorkerIds = existingAttendance.map(record => record.workerId);
      const missingWorkers = workersList.filter(worker => 
        !existingWorkerIds.includes(worker.worker_id)
      );

      // Create attendance records for missing workers
      for (const worker of missingWorkers) {
        await attendanceService.markAttendance({
          workerId: worker.worker_id,
          siteId: worker.site_id,
          date: selectedDate,
          status: 'Absent',
          checkInTime: '',
          checkOutTime: '',
          overtimeHours: 0,
          createdBy: 'system',
          updatedBy: 'system'
        });
      }
    } catch (error) {
      console.error("Failed to create missing attendance records:", error);
    }
  };

  const loadAttendanceRecords = async () => {
    setIsLoading(true);
    try {
      const filter: AttendanceFilter = {
        date: selectedDate,
        searchQuery: searchQuery
      };
      
      if (selectedSite !== "all") {
        filter.siteId = selectedSite;
      }
      
      const records = await attendanceService.getAttendance(filter);
      setAttendanceRecords(records);
      
      const present = records.filter(r => r.status === "Present").length;
      setPresentCount(present);
      setTotalCount(records.length);
    } catch (error) {
      toast.error("Failed to load attendance records");
    } finally {
      setIsLoading(false);
    }
  };

  // Reload attendance when date or site changes
  useEffect(() => {
    loadAttendanceRecords();
  }, [selectedDate, selectedSite, searchQuery]);

  const handleSearch = () => {
    loadAttendanceRecords();
  };

  const handleMarkAttendance = async (record: AttendanceRecord, status: 'Present' | 'Absent') => {
    try {
      if (status === 'Present') {
        await attendanceService.updateAttendance(record.id, {
          status: 'Present',
          checkInTime: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
          }),
          updatedBy: 'user'
        });
      } else {
        await attendanceService.updateAttendance(record.id, { 
          status: 'Absent',
          checkInTime: '',
          checkOutTime: '',
          updatedBy: 'user'
        });
      }
      loadAttendanceRecords();
      toast.success(`Attendance marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update attendance");
    }
  };

  const handleExportToExcel = () => {
    const data = attendanceRecords.map(record => ({
      'Date': record.date,
      'Worker ID': record.workerId,
      'Worker Name': record.workerName,
      'Site': record.siteName,
      'Status': record.status,
      'Check In': record.checkInTime,
      'Check Out': record.checkOutTime,
      'Overtime Hours': record.overtimeHours
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `attendance_${selectedDate}.xlsx`);
  };

  const formatTime = (time: string) => {
    if (!time) return "-";
    return time;
  };

  const handleDeleteWorker = async (workerId: string) => {
    setDeletingWorkerId(workerId);
    try {
      await workerService.deleteWorker(workerId);
      setWorkers(workers => workers.filter(w => w.id !== workerId));
      toast.success("Worker deleted");
      loadAttendanceRecords();
    } catch (e) {
      toast.error("Failed to delete worker");
    } finally {
      setDeletingWorkerId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance Management</h2>
          <p className="text-muted-foreground">
            Track and manage worker attendance across sites
          </p>
        </div>
        <div className="flex gap-2">
          {selectedSite !== "all" && (
            <AddWorkerDialog siteId={selectedSite} onWorkerAdded={loadWorkers} />
          )}
          <Button variant="outline" onClick={handleExportToExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>
                {selectedDate} | Total Present: {presentCount} / {totalCount}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row mb-6">
                <div className="flex items-center gap-2 flex-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="date" 
                    placeholder="Select date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="flex-1">
                  <Select value={selectedSite} onValueChange={setSelectedSite}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sites</SelectItem>
                      {sites.map((site) => (
                        <SelectItem key={site.id} value={site.id}>
                          {site.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search workers..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} size="sm">Search</Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Worker ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Overtime</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          <div className="flex justify-center">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : attendanceRecords.length > 0 ? (
                      attendanceRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.workerId}</TableCell>
                          <TableCell>{record.workerName || 'Loading...'}</TableCell>
                          <TableCell>{record.siteName || 'Loading...'}</TableCell>
                          <TableCell>{formatTime(record.checkInTime)}</TableCell>
                          <TableCell>{formatTime(record.checkOutTime)}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === "Present" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {record.status}
                            </span>
                          </TableCell>
                          <TableCell>{record.overtimeHours} hour(s)</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {record.status !== "Present" && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleMarkAttendance(record, "Present")}
                                >
                                  Mark Present
                                </Button>
                              )}
                              {record.status !== "Absent" && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleMarkAttendance(record, "Absent")}
                                >
                                  Mark Absent
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              {workers.find(w => w.worker_id === record.workerId) && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={deletingWorkerId === record.workerId}
                                  onClick={() => handleDeleteWorker(
                                    workers.find(w => w.worker_id === record.workerId)?.id || ""
                                  )}
                                >
                                  <UserMinus className="mr-1 h-4 w-4" />
                                  {deletingWorkerId === record.workerId ? "Deleting..." : "Delete"}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4">
                          {selectedSite === "all" ? 
                            "Select a site to view attendance records" : 
                            "No attendance records found. Add workers to this site to get started."
                          }
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Report</CardTitle>
              <CardDescription>
                View attendance trends for the current week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground">Weekly attendance chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Summary</CardTitle>
              <CardDescription>
                Monthly overview of worker attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground">Monthly attendance data will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
