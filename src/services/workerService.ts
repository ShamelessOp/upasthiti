
import { supabase } from "@/integrations/supabase/client";
import { Worker, WorkerFilter } from "@/models/worker";
import { toast } from "sonner";

export const workerService = {
  // Get workers with filter options
  async getWorkers(filter: WorkerFilter = {}): Promise<Worker[]> {
    let query = supabase
      .from('workers')
      .select('*');

    if (filter.siteId) {
      query = query.eq('site_id', filter.siteId);
    }

    if (filter.status) {
      query = query.eq('status', filter.status);
    }

    if (filter.skill) {
      query = query.contains('skills', [filter.skill]);
    }

    if (filter.searchQuery) {
      query = query.or(`name.ilike.%${filter.searchQuery}%,worker_id.ilike.%${filter.searchQuery}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to retrieve workers: " + error.message);
      throw error;
    }

    return data as Worker[];
  },

  // Get worker by ID
  async getWorkerById(id: string): Promise<Worker | null> {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error("Failed to retrieve worker: " + error.message);
      throw error;
    }

    return data as Worker;
  },

  // Create new worker
  async createWorker(workerData: Omit<Worker, 'id' | 'created_at' | 'updated_at'>): Promise<Worker> {
    const { data, error } = await supabase
      .from('workers')
      .insert([workerData])
      .select()
      .single();

    if (error) {
      toast.error("Failed to create worker: " + error.message);
      throw error;
    }

    toast.success("Worker added successfully");
    return data as Worker;
  },

  // Update worker
  async updateWorker(id: string, workerData: Partial<Worker>): Promise<Worker> {
    const { data, error } = await supabase
      .from('workers')
      .update(workerData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error("Failed to update worker: " + error.message);
      throw error;
    }

    toast.success("Worker updated successfully");
    return data as Worker;
  },

  // Delete worker
  async deleteWorker(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('workers')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete worker: " + error.message);
      throw error;
    }

    toast.success("Worker deleted successfully");
    return true;
  }
};
