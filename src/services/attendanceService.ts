
import { supabase } from "@/integrations/supabase/client";
import { AttendanceRecord, AttendanceFilter, AttendanceSummary, AttendanceStatus } from "@/models/attendance";

class AttendanceService {
  async getAttendance(filter?: AttendanceFilter): Promise<AttendanceRecord[]> {
    try {
      let query = supabase
        .from("attendance")
        .select(`
          *,
          worker:workers!inner(name, worker_id),
          site:sites!inner(name)
        `);

      if (filter) {
        if (filter.siteId) {
          query = query.eq("site_id", filter.siteId);
        }
        if (filter.date) {
          query = query.eq("date", filter.date);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching attendance:", error);
        throw error;
      }

      let results = (data || []).map(record => ({
        id: record.id,
        workerId: record.worker?.worker_id || "",
        workerName: record.worker?.name || "",
        siteId: record.site_id,
        siteName: record.site?.name || "",
        date: record.date,
        status: record.status as AttendanceStatus,
        checkInTime: record.check_in_time || "",
        checkOutTime: record.check_out_time || "",
        overtimeHours: record.overtime_hours || 0,
        createdBy: record.created_by,
        updatedBy: record.updated_by,
        createdAt: record.created_at,
        updatedAt: record.updated_at
      }));

      // Apply search filter if provided
      if (filter?.searchQuery) {
        const searchLower = filter.searchQuery.toLowerCase();
        results = results.filter(record => 
          record.workerName.toLowerCase().includes(searchLower) ||
          record.workerId.toLowerCase().includes(searchLower)
        );
      }

      return results;
    } catch (error) {
      console.error("Failed to fetch attendance records:", error);
      throw error;
    }
  }

  async getAttendanceSummary(): Promise<AttendanceSummary> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's attendance
      const { data: todayAttendance, error: attendanceError } = await supabase
        .from("attendance")
        .select("status")
        .eq("date", today);

      if (attendanceError) {
        console.error("Error fetching today's attendance:", attendanceError);
        throw attendanceError;
      }

      // Get total workers count
      const { count: totalWorkers, error: workersError } = await supabase
        .from("workers")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      if (workersError) {
        console.error("Error fetching workers count:", workersError);
        throw workersError;
      }

      const present = (todayAttendance || []).filter(record => record.status === "Present").length;
      const absent = (todayAttendance || []).filter(record => record.status === "Absent").length;

      return {
        totalWorkers: totalWorkers || 0,
        present,
        absent
      };
    } catch (error) {
      console.error("Failed to fetch attendance summary:", error);
      throw error;
    }
  }

  async markAttendance(record: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .insert({
          worker_id: record.workerId,
          site_id: record.siteId,
          date: record.date,
          status: record.status,
          check_in_time: record.checkInTime,
          check_out_time: record.checkOutTime,
          overtime_hours: record.overtimeHours || 0,
          created_by: record.createdBy,
          updated_by: record.updatedBy
        })
        .select(`
          *,
          worker:workers!inner(name, worker_id),
          site:sites!inner(name)
        `)
        .single();

      if (error) {
        console.error("Error marking attendance:", error);
        throw error;
      }

      return {
        id: data.id,
        workerId: data.worker?.worker_id || "",
        workerName: data.worker?.name || "",
        siteId: data.site_id,
        siteName: data.site?.name || "",
        date: data.date,
        status: data.status as AttendanceStatus,
        checkInTime: data.check_in_time || "",
        checkOutTime: data.check_out_time || "",
        overtimeHours: data.overtime_hours || 0,
        createdBy: data.created_by,
        updatedBy: data.updated_by,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      throw error;
    }
  }

  async updateAttendance(id: string, updates: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .update({
          status: updates.status,
          check_in_time: updates.checkInTime,
          check_out_time: updates.checkOutTime,
          overtime_hours: updates.overtimeHours,
          updated_by: updates.updatedBy,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select(`
          *,
          worker:workers!inner(name, worker_id),
          site:sites!inner(name)
        `)
        .single();

      if (error) {
        console.error("Error updating attendance:", error);
        throw error;
      }

      return {
        id: data.id,
        workerId: data.worker?.worker_id || "",
        workerName: data.worker?.name || "",
        siteId: data.site_id,
        siteName: data.site?.name || "",
        date: data.date,
        status: data.status as AttendanceStatus,
        checkInTime: data.check_in_time || "",
        checkOutTime: data.check_out_time || "",
        overtimeHours: data.overtime_hours || 0,
        createdBy: data.created_by,
        updatedBy: data.updated_by,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error("Failed to update attendance:", error);
      throw error;
    }
  }
}

export const attendanceService = new AttendanceService();
