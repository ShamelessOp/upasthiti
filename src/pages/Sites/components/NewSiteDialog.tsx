
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { siteService } from '@/services/siteService';
import { CreateSiteInput } from '@/models/site';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface NewSiteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const siteSchema = z.object({
  name: z.string().min(1, 'Site name is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  status: z.string(),
  start_date: z.string()
});

export default function NewSiteDialog({ open, onOpenChange }: NewSiteDialogProps) {
  const queryClient = useQueryClient();
  const form = useForm<CreateSiteInput>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      name: '',
      location: '',
      description: '',
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
    },
  });

  const { mutate: createSite, isPending } = useMutation({
    mutationFn: siteService.createSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      onOpenChange(false);
      form.reset();
      toast.success('Site created successfully');
    },
    onError: (error) => {
      console.error('Error creating site:', error);
      toast.error('Failed to create site. Please try again.');
    }
  });

  const onSubmit = (data: CreateSiteInput) => {
    try {
      createSite(data);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to process form. Please check your inputs and try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Site</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Site
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
