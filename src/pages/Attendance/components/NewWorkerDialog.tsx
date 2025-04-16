
import React from 'react';
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Worker } from "@/models/worker";
import { workerService } from "@/services/workerService";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

type WorkerFormData = Omit<Worker, 'id' | 'created_at' | 'updated_at'>;

export function NewWorkerDialog({ siteId, onWorkerAdded }: { siteId: string, onWorkerAdded?: () => void }) {
  const [open, setOpen] = React.useState(false);
  const form = useForm<WorkerFormData>();

  const onSubmit = async (data: WorkerFormData) => {
    try {
      await workerService.createWorker({
        ...data,
        site_id: siteId,
        status: 'active',
        skills: []
      });
      setOpen(false);
      onWorkerAdded?.();
    } catch (error) {
      console.error('Error creating worker:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Worker
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Worker</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="worker_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Worker ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter worker ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter worker name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="daily_wage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Wage</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter daily wage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Worker
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
