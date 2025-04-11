
import { AttendanceFilter, AttendanceRecord, AttendanceSummary, AttendanceStatus } from "@/models/attendance";
import { apiRequest } from "./api";
import { localStorageService } from "./localStorage";
import { authService } from "./authService";

// Local storage keys
const ATTENDANCE_STORAGE_KEY = "attendance_records";

// Mock initial data
const INITIAL_ATTENDANCE_DATA: AttendanceRecord[] = [
  {
    id: "1",
    workerId: "W001",
    workerName: "Rajesh Kumar",
    siteId: "1",
    siteName: "Site A - Residential Complex",
    date: "2025-04-11",
    checkInTime: "08:00",
    checkOutTime: "17:00",
    status: "Present",
    overtimeHours: 1,
    createdBy: "1",
    updatedBy: "1",
    createdAt: "2025-04-11T08:00:00Z",
    updatedAt: "2025-04-11T17:00:00Z"
  },
  {
    id: "2",
    workerId: "W002",
    workerName: "Sunil Sharma",
    siteId: "1",
    siteName: "Site A - Residential Complex",
    date: "2025-04-11",
    checkInTime: "08:15",
    checkOutTime: "16:45",
    status: "Present",
    overtimeHours: 0,
    createdBy: "1",
    updatedBy: "1",
    createdAt: "2025-04-11T08:15:00Z",
    updatedAt: "2025-04-11T16:45:00Z"
  },
  {
    id: "3",
    workerId: "W003",
    workerName: "Priya Patel",
    siteId: "2",
    siteName: "Site B - Commercial Building",
    date: "2025-04-11",
    checkInTime: "08:30",
    checkOutTime: "17:30",
    status: "Present",
    overtimeHours: 1.5,
    createdBy: "2",
    updatedBy: "2",
    createdAt: "2025-04-11T08:30:00Z",
    updatedAt: "2025-04-11T17:30:00Z"
  },
  {
    id: "4",
    workerId: "W004",
    workerName: "Amit Singh",
    siteId: "3",
    siteName: "Site C - Highway Project",
    date: "2025-04-11",
    checkInTime: "",
    checkOutTime: "",
    status: "Absent",
    overtimeHours: 0,
    createdBy: "3",
    updatedBy: "3",
    createdAt: "2025-04-11T00:00:00Z",
    updatedAt: "2025-04-11T00:00:00Z"
  },
  {
    id: "5",
    workerId: "W005",
    workerName: "Neha Gupta",
    siteId: "2",
    siteName: "Site B - Commercial Building",
    date: "2025-04-11",
    checkInTime: "08:05",
    checkOutTime: "18:00",
    status: "Present",
    overtimeHours: 2,
    createdBy: "2",
    updatedBy: "2",
    createdAt: "2025-04-11T08:05:00Z",
    updatedAt: "2025-04-11T18:00:00Z"
  },
];

// Initialize local storage with mock data if empty
const initializeAttendanceData = (): AttendanceRecord[] => {
  const existingData = localStorageService.get<AttendanceRecord[]>(ATTENDANCE_STORAGE_KEY);
  if (!existingData) {
    localStorageService.set(ATTENDANCE_STORAGE_KEY, INITIAL_ATTENDANCE_DATA);
    return INITIAL_ATTENDANCE_DATA;
  }
  return existingData;
};

export const attendanceService = {
  // Get attendance records with filtering
  async getAttendance(filter: AttendanceFilter = {}): Promise<AttendanceRecord[]> {
    return apiRequest<AttendanceRecord[]>(async () => {
      const records = initializeAttendanceData();
      
      return records.filter(record => {
        // Filter by site
        if (filter.siteId && record.siteId !== filter.siteId) {
          return false;
        }
        
        // Filter by date
        if (filter.date && record.date !== filter.date) {
          return false;
        }
        
        // Filter by date range
        if (filter.startDate && filter.endDate) {
          const recordDate = new Date(record.date);
          const startDate = new Date(filter.startDate);
          const endDate = new Date(filter.endDate);
          
          if (recordDate < startDate || recordDate > endDate) {
            return false;
          }
        }
        
        // Filter by status
        if (filter.status && record.status !== filter.status) {
          return false;
        }
        
        // Filter by search query
        if (filter.searchQuery) {
          const query = filter.searchQuery.toLowerCase();
          return (
            record.workerName.toLowerCase().includes(query) ||
            record.workerId.toLowerCase().includes(query)
          );
        }
        
        return true;
      });
    }, "Failed to retrieve attendance records").then(response => response.data || []);
  },

  // Get attendance record by ID
  async getAttendanceById(id: string): Promise<AttendanceRecord | null> {
    return apiRequest<AttendanceRecord>(async () => {
      const records = initializeAttendanceData();
      const record = records.find(r => r.id === id);
      
      if (!record) {
        throw new Error("Attendance record not found");
      }
      
      return record;
    }, "Failed to retrieve attendance record").then(response => response.data);
  },

  // Mark attendance (check in)
  async markAttendance(data: Partial<AttendanceRecord>): Promise<AttendanceRecord | null> {
    return apiRequest<AttendanceRecord>(async () => {
      const records = initializeAttendanceData();
      const user = authService.getCurrentUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const now = new Date();
      const nowIso = now.toISOString();
      const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      
      // Check if record already exists for this worker and date
      const existingIndex = records.findIndex(
        r => r.workerId === data.workerId && r.date === data.date
      );
      
      let newRecord: AttendanceRecord;
      
      if (existingIndex >= 0) {
        // Update existing record
        newRecord = {
          ...records[existingIndex],
          ...data,
          checkInTime: data.checkInTime || timeString,
          status: "Present" as AttendanceStatus,
          updatedBy: user.id,
          updatedAt: nowIso
        };
        
        records[existingIndex] = newRecord;
      } else {
        // Create new record
        newRecord = {
          id: `${Date.now()}`,
          workerId: data.workerId || "",
          workerName: data.workerName || "",
          siteId: data.siteId || "",
          siteName: data.siteName || "",
          date: data.date || now.toISOString().split('T')[0],
          checkInTime: data.checkInTime || timeString,
          checkOutTime: data.checkOutTime || "",
          status: "Present" as AttendanceStatus,
          overtimeHours: 0,
          createdBy: user.id,
          updatedBy: user.id,
          createdAt: nowIso,
          updatedAt: nowIso
        };
        
        records.push(newRecord);
      }
      
      localStorageService.set(ATTENDANCE_STORAGE_KEY, records);
      return newRecord;
    }, "Failed to mark attendance").then(response => response.data);
  },

  // Mark checkout
  async markCheckout(id: string, checkOutTime?: string): Promise<AttendanceRecord | null> {
    return apiRequest<AttendanceRecord>(async () => {
      const records = initializeAttendanceData();
      const user = authService.getCurrentUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const recordIndex = records.findIndex(r => r.id === id);
      
      if (recordIndex === -1) {
        throw new Error("Attendance record not found");
      }
      
      const now = new Date();
      const timeString = checkOutTime || now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      
      // Calculate overtime hours
      let overtimeHours = 0;
      if (records[recordIndex].checkInTime) {
        const checkInParts = records[recordIndex].checkInTime.split(':');
        const checkOutParts = timeString.split(':');
        
        const checkInHours = parseInt(checkInParts[0]);
        const checkOutHours = parseInt(checkOutParts[0]);
        
        // Assuming 8-hour workday, calculate overtime
        const hoursWorked = checkOutHours - checkInHours;
        if (hoursWorked > 8) {
          overtimeHours = hoursWorked - 8;
        }
      }
      
      const updatedRecord = {
        ...records[recordIndex],
        checkOutTime: timeString,
        overtimeHours,
        updatedBy: user.id,
        updatedAt: now.toISOString()
      };
      
      records[recordIndex] = updatedRecord;
      localStorageService.set(ATTENDANCE_STORAGE_KEY, records);
      
      return updatedRecord;
    }, "Failed to mark checkout").then(response => response.data);
  },

  // Update attendance record
  async updateAttendance(id: string, data: Partial<AttendanceRecord>): Promise<AttendanceRecord | null> {
    return apiRequest<AttendanceRecord>(async () => {
      const records = initializeAttendanceData();
      const user = authService.getCurrentUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const recordIndex = records.findIndex(r => r.id === id);
      
      if (recordIndex === -1) {
        throw new Error("Attendance record not found");
      }
      
      const updatedRecord = {
        ...records[recordIndex],
        ...data,
        updatedBy: user.id,
        updatedAt: new Date().toISOString()
      };
      
      records[recordIndex] = updatedRecord;
      localStorageService.set(ATTENDANCE_STORAGE_KEY, records);
      
      return updatedRecord;
    }, "Failed to update attendance record").then(response => response.data);
  },

  // Delete attendance record
  async deleteAttendance(id: string): Promise<boolean> {
    return apiRequest<boolean>(async () => {
      const records = initializeAttendanceData();
      const recordIndex = records.findIndex(r => r.id === id);
      
      if (recordIndex === -1) {
        throw new Error("Attendance record not found");
      }
      
      records.splice(recordIndex, 1);
      localStorageService.set(ATTENDANCE_STORAGE_KEY, records);
      
      return true;
    }, "Failed to delete attendance record").then(response => response.success);
  },

  // Get attendance summary
  async getAttendanceSummary(date?: string): Promise<AttendanceSummary> {
    return apiRequest<AttendanceSummary>(async () => {
      const records = initializeAttendanceData();
      const targetDate = date || new Date().toISOString().split('T')[0];
      
      const dayRecords = records.filter(r => r.date === targetDate);
      
      const present = dayRecords.filter(r => r.status === "Present").length;
      const absent = dayRecords.filter(r => r.status === "Absent").length;
      const leave = dayRecords.filter(r => r.status === "Leave").length;
      const halfDay = dayRecords.filter(r => r.status === "HalfDay").length;
      
      const totalWorkers = dayRecords.length;
      const averageAttendance = totalWorkers > 0 ? (present / totalWorkers) * 100 : 0;
      
      return {
        totalWorkers,
        present,
        absent,
        leave,
        halfDay,
        averageAttendance
      };
    }, "Failed to retrieve attendance summary").then(response => response.data || {
      totalWorkers: 0,
      present: 0,
      absent: 0,
      leave: 0,
      halfDay: 0,
      averageAttendance: 0
    });
  }
};
