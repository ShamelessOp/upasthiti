
import { supabase } from "@/integrations/supabase/client";
import { Worker, WorkerFilter } from "@/models/worker";
import { toast } from "sonner";

export const workerService = {
  async getAllWorkers(filter?: WorkerFilter): Promise<Worker[]> {
    console.log("Fetching workers with filter:", filter);
    
    let query = supabase
      .from('workers')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter?.siteId) {
      query = query.eq('site_id', filter.siteId);
    }

    if (filter?.status) {
      query = query.eq('status', filter.status);
    }

    if (filter?.skill) {
      query = query.contains('skills', [filter.skill]);
    }

    if (filter?.searchQuery) {
      query = query.or(`name.ilike.%${filter.searchQuery}%,worker_id.ilike.%${filter.searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Worker fetch error:", error);
      toast.error("Failed to fetch workers: " + error.message);
      throw error;
    }

    console.log("Workers fetched:", data);
    return data as Worker[];
  },

  async createWorker(worker: Omit<Worker, 'id' | 'created_at' | 'updated_at'>): Promise<Worker> {
    console.log("Creating worker:", worker);
    
    const { data, error } = await supabase
      .from('workers')
      .insert([worker])
      .select()
      .single();

    if (error) {
      console.error("Worker creation error:", error);
      toast.error("Failed to create worker: " + error.message);
      throw error;
    }

    toast.success("Worker created successfully");
    return data as Worker;
  },
  
  async updateWorker(id: string, worker: Partial<Worker>): Promise<Worker> {
    const { data, error } = await supabase
      .from('workers')
      .update(worker)
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

  async deleteWorker(id: string): Promise<void> {
    const { error } = await supabase
      .from('workers')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete worker: " + error.message);
      throw error;
    }

    toast.success("Worker deleted successfully");
  }
};
