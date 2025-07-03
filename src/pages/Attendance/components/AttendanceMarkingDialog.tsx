import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AttendanceRecord, AttendanceStatus } from '@/models/attendance';
import { attendanceService } from '@/services/attendanceService';
import { toast } from 'sonner';

interface AttendanceMarkingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: AttendanceRecord | null;
  onUpdate: () => void;
}

export function AttendanceMarkingDialog({ 
  open, 
  onOpenChange, 
  record, 
  onUpdate 
}: AttendanceMarkingDialogProps) {
  const [status, setStatus] = useState<AttendanceStatus>(record?.status || 'Present');
  const [checkInTime, setCheckInTime] = useState(record?.checkInTime || '');
  const [checkOutTime, setCheckOutTime] = useState(record?.checkOutTime || '');
  const [overtimeHours, setOvertimeHours] = useState(record?.overtimeHours?.toString() || '0');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!record) return;

    setIsSubmitting(true);
    try {
      await attendanceService.updateAttendance(record.id, {
        status,
        checkInTime: status === 'Present' ? checkInTime : '',
        checkOutTime: status === 'Present' ? checkOutTime : '',
        overtimeHours: status === 'Present' ? Number(overtimeHours) : 0,
        updatedBy: 'user'
      });

      toast.success('Attendance updated successfully');
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!record) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Attendance - {record.workerName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(value: AttendanceStatus) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
                <SelectItem value="Leave">Leave</SelectItem>
                <SelectItem value="HalfDay">Half Day</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {status === 'Present' && (
            <>
              <div>
                <Label>Check In Time</Label>
                <Input
                  type="time"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                />
              </div>

              <div>
                <Label>Check Out Time</Label>
                <Input
                  type="time"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                />
              </div>

              <div>
                <Label>Overtime Hours</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.5"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Attendance'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}