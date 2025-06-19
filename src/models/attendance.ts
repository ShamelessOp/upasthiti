
// Attendance data models

export type AttendanceStatus = "Present" | "Absent" | "Leave" | "HalfDay";

export interface AttendanceRecord {
  id: string;
  workerId: string;
  workerName: string;
  siteId: string;
  siteName: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: AttendanceStatus;
  overtimeHours: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceFilter {
  siteId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatus;
  searchQuery?: string;
}

export interface AttendanceSummary {
  totalWorkers: number;
  present: number;
  absent: number;
  leave?: number;
  halfDay?: number;
  averageAttendance?: number;
}
