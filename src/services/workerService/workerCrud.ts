
import { supabase } from "@/integrations/supabase/client";
import { Worker, WorkerFilter } from "@/models/worker";
import { toast } from "sonner";
import { localStorageService } from "../localStorage";
import { filterWorkers } from "./workerFilter";
import { addSampleWorkers } from "./workerSample";

const WORKERS_STORAGE_KEY = "workers";

export const workerCrud = {
  async getAllWorkers(filter?: WorkerFilter): Promise<Worker[]> {
    try {
      const localWorkers = localStorageService.get<Worker[]>(WORKERS_STORAGE_KEY);
      let filteredWorkers: Worker[] = [];
      if (localWorkers && localWorkers.length > 0) {
        filteredWorkers = filterWorkers(localWorkers, filter);
        if (filteredWorkers.length > 0 || !filter?.siteId) {
          return filteredWorkers;
        }
      }

      let query = supabase
        .from("workers")
        .select("*")
        .order("created_at", { ascending: false });
      if (filter?.siteId) query = query.eq("site_id", filter.siteId);
      if (filter?.status) query = query.eq("status", filter.status);
      if (filter?.skill) query = query.contains("skills", [filter.skill]);
      if (filter?.searchQuery)
        query = query.or(
          `name.ilike.%${filter.searchQuery}%,worker_id.ilike.%${filter.searchQuery}%`
        );

      const { data, error } = await query;
      if (error) {
        console.error("Supabase error:", error);
        if (filter?.siteId && (!filteredWorkers || filteredWorkers.length === 0)) {
          const sampleWorkers = await addSampleWorkers(filter.siteId);
          return filterWorkers(sampleWorkers, filter);
        }
        return filteredWorkers;
      }

      if (data && data.length > 0) {
        const existingWorkers = localWorkers || [];
        const newWorkers = data as Worker[];
        const mergedWorkers = [...existingWorkers];
        for (const newWorker of newWorkers) {
          const index = mergedWorkers.findIndex(w => w.id === newWorker.id);
          if (index >= 0) {
            mergedWorkers[index] = newWorker;
          } else {
            mergedWorkers.push(newWorker);
          }
        }
        localStorageService.set(WORKERS_STORAGE_KEY, mergedWorkers);
        return filterWorkers(mergedWorkers, filter);
      }

      if (filter?.siteId && (!filteredWorkers || filteredWorkers.length === 0)) {
        const sampleWorkers = await addSampleWorkers(filter.siteId);
        return filterWorkers(sampleWorkers, filter);
      }

      return filteredWorkers;
    } catch (error) {
      console.error("Error in getAllWorkers:", error);
      return [];
    }
  },

  async createWorker(worker: Omit<Worker, 'id' | 'created_at' | 'updated_at'>): Promise<Worker> {
    try {
      const { data, error } = await supabase
        .from("workers")
        .insert([worker])
        .select()
        .single();

      if (error) throw error;

      const localWorkers = localStorageService.get<Worker[]>(WORKERS_STORAGE_KEY) || [];
      localWorkers.push(data as Worker);
      localStorageService.set(WORKERS_STORAGE_KEY, localWorkers);

      toast.success("Worker created successfully");
      return data as Worker;
    } catch (error) {
      console.error("Failed to create worker:", error);
      toast.error("Failed to create worker");
      throw error;
    }
  },

  async getWorkerById(id: string): Promise<Worker | null> {
    try {
      const localWorkers = localStorageService.get<Worker[]>(WORKERS_STORAGE_KEY);
      if (localWorkers) {
        const worker = localWorkers.find(worker => worker.id === id);
        if (worker) return worker;
      }

      const { data, error } = await supabase
        .from("workers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Worker;
    } catch (error) {
      console.error("Failed to fetch worker:", error);
      return null;
    }
  },

  async updateWorker(id: string, worker: Partial<Worker>): Promise<Worker> {
    try {
      const { data, error } = await supabase
        .from("workers")
        .update(worker)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      const localWorkers = localStorageService.get<Worker[]>(WORKERS_STORAGE_KEY) || [];
      const updatedWorkers = localWorkers.map(w =>
        w.id === id ? { ...w, ...worker } : w
      );
      localStorageService.set(WORKERS_STORAGE_KEY, updatedWorkers);

      toast.success("Worker updated successfully");
      return data as Worker;
    } catch (error) {
      console.error("Failed to update worker:", error);
      toast.error("Failed to update worker");
      throw error;
    }
  },

  async deleteWorker(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("workers")
        .delete()
        .eq("id", id);

      if (error) throw error;

      const localWorkers = localStorageService.get<Worker[]>(WORKERS_STORAGE_KEY) || [];
      const filteredWorkers = localWorkers.filter(w => w.id !== id);
      localStorageService.set(WORKERS_STORAGE_KEY, filteredWorkers);

      toast.success("Worker deleted successfully");
      return true;
    } catch (error) {
      console.error("Failed to delete worker:", error);
      toast.error("Failed to delete worker");
      throw error;
    }
  }
};
