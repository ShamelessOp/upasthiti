
import { Worker, WorkerStatus } from "@/models/worker";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateWorkerInput {
  worker_id: string;
  name: string;
  contact_number: string;
  address?: string;
  skills: string[];
  daily_wage: number;
  joining_date: string;
  site_id: string;
  status?: WorkerStatus;
}

interface UpdateWorkerInput {
  worker_id?: string;
  name?: string;
  contact_number?: string;
  address?: string;
  skills?: string[];
  daily_wage?: number;
  joining_date?: string;
  site_id?: string;
  status?: WorkerStatus;
}

export const workerCrud = {
  // Get all workers from Supabase
  async getAllWorkers(): Promise<Worker[]> {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching workers:", error);
        toast.error("Failed to fetch workers");
        return [];
      }

      return data as Worker[];
    } catch (error) {
      console.error("Error in getAllWorkers:", error);
      toast.error("Failed to fetch workers");
      return [];
    }
  },

  // Get workers by site ID from Supabase
  async getWorkersBySiteId(siteId: string): Promise<Worker[]> {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('site_id', siteId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching workers by site:", error);
        toast.error("Failed to fetch workers");
        return [];
      }

      return data as Worker[];
    } catch (error) {
      console.error("Error in getWorkersBySiteId:", error);
      toast.error("Failed to fetch workers");
      return [];
    }
  },

  // Get worker by ID from Supabase
  async getWorkerById(id: string): Promise<Worker | null> {
    try {
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching worker:", error);
        return null;
      }

      return data as Worker;
    } catch (error) {
      console.error("Failed to retrieve worker:", error);
      return null;
    }
  },

  // Create new worker in Supabase
  async createWorker(workerData: CreateWorkerInput): Promise<Worker | null> {
    try {
      const newWorker = {
        ...workerData,
        status: workerData.status || 'active' as WorkerStatus
      };

      const { data, error } = await supabase
        .from('workers')
        .insert([newWorker])
        .select()
        .single();

      if (error) {
        console.error("Error creating worker:", error);
        toast.error("Failed to create worker");
        return null;
      }

      toast.success("Worker created successfully");
      return data as Worker;
    } catch (error) {
      console.error("Failed to create worker:", error);
      toast.error("Failed to create worker");
      return null;
    }
  },

  // Update worker in Supabase
  async updateWorker(id: string, workerData: UpdateWorkerInput): Promise<Worker | null> {
    try {
      const { data, error } = await supabase
        .from('workers')
        .update(workerData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Error updating worker:", error);
        toast.error("Failed to update worker");
        return null;
      }

      toast.success("Worker updated successfully");
      return data as Worker;
    } catch (error) {
      console.error("Failed to update worker:", error);
      toast.error("Failed to update worker");
      return null;
    }
  },

  // Delete worker from Supabase
  async deleteWorker(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('workers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting worker:", error);
        toast.error("Failed to delete worker");
        return false;
      }

      toast.success("Worker deleted successfully");
      return true;
    } catch (error) {
      console.error("Failed to delete worker:", error);
      toast.error("Failed to delete worker");
      return false;
    }
  }
};
