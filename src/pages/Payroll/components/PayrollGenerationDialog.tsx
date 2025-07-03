import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { payrollService } from '@/services/payrollService';
import { siteService } from '@/services/siteService';
import { Site } from '@/models/site';
import { toast } from 'sonner';

interface PayrollGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPayrollGenerated: () => void;
}

export function PayrollGenerationDialog({ open, onOpenChange, onPayrollGenerated }: PayrollGenerationDialogProps) {
  const [sites, setSites] = useState<Site[]>([]);
  const [formData, setFormData] = useState({
    siteId: '',
    startDate: '',
    endDate: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadSites = async () => {
      const siteData = await siteService.getAllSites();
      setSites(siteData);
    };
    loadSites();
  }, []);

  const handleGenerate = async () => {
    if (!formData.siteId || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsGenerating(true);
    try {
      await payrollService.generatePayroll(formData.siteId, formData.startDate, formData.endDate);
      onPayrollGenerated();
      onOpenChange(false);
      setFormData({ siteId: '', startDate: '', endDate: '' });
    } catch (error) {
      toast.error('Failed to generate payroll');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Payroll</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Site</Label>
            <Select 
              value={formData.siteId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, siteId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent>
                {sites.map(site => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Payroll'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}