
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { workerService } from '@/services/workerService';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface NewWorkerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId: string;
  onSuccess?: () => void;
}

interface WorkerFormData {
  name: string;
  worker_id: string;
  contact_number: string;
  daily_wage: number;
  joining_date: Date;
  status: 'active' | 'inactive';
  address?: string;
  skills?: string;
}

const SKILLS = [
  'Mason', 'Carpenter', 'Electrician', 'Plumber',
  'Painter', 'Welder', 'Helper', 'Driver',
  'Security', 'Supervisor', 'Cleaner', 'Other'
];

export default function NewWorkerDialog({ open, onOpenChange, siteId, onSuccess }: NewWorkerDialogProps) {
  const form = useForm<WorkerFormData>({
    defaultValues: {
      name: '',
      worker_id: '',
      contact_number: '',
      daily_wage: 0,
      joining_date: new Date(),
      status: 'active',
      address: '',
      skills: '',
    },
  });

  const { mutate: createWorker, isPending } = useMutation({
    mutationFn: workerService.createWorker,
    onSuccess: () => {
      onOpenChange(false);
      form.reset();
      if (onSuccess) onSuccess();
    },
  });

  const onSubmit = (data: WorkerFormData) => {
    const skills = data.skills ? data.skills.split(',').map(s => s.trim()) : [];
    
    createWorker({
      name: data.name,
      worker_id: data.worker_id,
      contact_number: data.contact_number,
      daily_wage: data.daily_wage,
      joining_date: format(data.joining_date, 'yyyy-MM-dd'),
      status: data.status,
      address: data.address,
      skills: skills,
      site_id: siteId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Worker</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="worker_id"
                rules={{ required: "Worker ID is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Worker ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact_number"
                rules={{ required: "Contact number is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="daily_wage"
                rules={{ required: "Daily wage is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Wage (₹)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="joining_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Joining Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : "Select date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills (Optional, comma separated)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Mason, Carpenter, Electrician" />
                  </FormControl>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {SKILLS.map(skill => (
                      <Button 
                        key={skill} 
                        type="button" 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => {
                          const currentSkills = field.value ? field.value.split(',').map(s => s.trim()) : [];
                          if (!currentSkills.includes(skill)) {
                            field.onChange(currentSkills.length ? `${field.value}, ${skill}` : skill);
                          }
                        }}
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Worker
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
