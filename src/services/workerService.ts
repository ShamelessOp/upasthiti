
import { supabase } from "@/integrations/supabase/client";
import { Worker, WorkerFilter } from "@/models/worker";
import { toast } from "sonner";

export const workerService = {
  async getAllWorkers(filter?: WorkerFilter): Promise<Worker[]> {
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
      toast.error("Failed to fetch workers: " + error.message);
      throw error;
    }

    return data as Worker[];
  },

  async createWorker(worker: Omit<Worker, 'id' | 'created_at' | 'updated_at'>): Promise<Worker> {
    const { data, error } = await supabase
      .from('workers')
      .insert([worker])
      .select()
      .single();

    if (error) {
      toast.error("Failed to create worker: " + error.message);
      throw error;
    }

    toast.success("Worker created successfully");
    return data as Worker;
  }
};
