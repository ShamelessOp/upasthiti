import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cashbookService } from '@/services/cashbookService';
import { siteService } from '@/services/siteService';
import { Site } from '@/models/site';
import { toast } from 'sonner';

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionAdded: () => void;
}

export function AddTransactionDialog({ open, onOpenChange, onTransactionAdded }: AddTransactionDialogProps) {
  const [sites, setSites] = useState<Site[]>([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    siteId: '',
    transactionType: '',
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    reference: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadSites = async () => {
      const siteData = await siteService.getAllSites();
      setSites(siteData);
    };
    loadSites();
  }, []);

  const transactionTypes = [
    { name: 'Material Purchase', type: 'expense' },
    { name: 'Wages Payment', type: 'expense' },
    { name: 'Equipment Rental', type: 'expense' },
    { name: 'Transport', type: 'expense' },
    { name: 'Petty Cash', type: 'expense' },
    { name: 'Fund Transfer', type: 'income' },
    { name: 'Advance Payment', type: 'income' },
    { name: 'Project Payment', type: 'income' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedSite = sites.find(s => s.id === formData.siteId);
      
      await cashbookService.addTransaction({
        ...formData,
        siteName: selectedSite?.name || '',
        amount: Number(formData.amount),
        reference: formData.reference || `REF-${Date.now()}`
      });

      onTransactionAdded();
      onOpenChange(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        siteId: '',
        transactionType: '',
        description: '',
        amount: '',
        type: 'expense',
        reference: ''
      });
    } catch (error) {
      toast.error('Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Cash Transaction</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

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

          <div>
            <Label>Transaction Type</Label>
            <Select 
              value={formData.transactionType} 
              onValueChange={(value) => {
                const selectedType = transactionTypes.find(t => t.name === value);
                setFormData(prev => ({ 
                  ...prev, 
                  transactionType: value,
                  type: (selectedType?.type as 'income' | 'expense') || 'expense'
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                {transactionTypes.map(type => (
                  <SelectItem key={type.name} value={type.name}>
                    {type.name} ({type.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter transaction details"
              required
            />
          </div>

          <div>
            <Label>Amount (₹)</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label>Reference Number</Label>
            <Input
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              placeholder="Auto-generated if empty"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}