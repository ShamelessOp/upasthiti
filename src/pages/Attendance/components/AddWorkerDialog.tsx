
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Briefcase, DollarSign, Phone } from "lucide-react";
import { workerService } from "@/services/workerService";
import { toast } from "sonner";
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddWorkerDialogProps {
  
  siteId: string;
  onWorkerAdded?: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  wage: z.string().optional(),
  wageType: z.string().default("Day"),
  phone: z.string().optional()
});

export function AddWorkerDialog({ siteId, onWorkerAdded }: AddWorkerDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      wage: "",
      wageType: "Day",
      phone: ""
    }
  });

  const generateWorkerId = () => {
    return `WKR${Math.floor(Math.random() * 100000)}`;
  };

  const { mutate: createWorker, isPending } = useMutation({
    mutationFn: (data: any) => {
      return workerService.createWorker({
        worker_id: generateWorkerId(),
        name: data.name,
        contact_number: data.phone || "",
        address: "",
        skills: [data.role].filter(Boolean),
        daily_wage: data.wageType === "Day" ? Number(data.wage) || 0 : 0,
        joining_date: new Date().toISOString().split("T")[0],
        site_id: siteId,
        status: "active"
      });
    },
    onSuccess: () => {
      toast.success("Worker added successfully");
      setOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      onWorkerAdded?.();
    },
    onError: () => {
      toast.error("Failed to add worker");
    }
  });

  const onSubmit = (data: any) => {
    createWorker(data);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <UserPlus className="mr-2 h-4 w-4" />
        Add Worker
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Worker</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name*</FormLabel>
                    <FormControl>
                      <Input required placeholder="Worker name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Briefcase className="inline mr-1" /> Work Role
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Mason, Electrician" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="wage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <DollarSign className="inline mr-1" /> Wage
                      </FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 800" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="wageType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Day">Per Day</SelectItem>
                          <SelectItem value="Hour">Per Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Phone className="inline mr-1" /> Phone
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Adding..." : "Add Worker"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
