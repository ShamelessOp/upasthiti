
import { supabase } from "@/integrations/supabase/client";
import { Worker, WorkerFilter } from "@/models/worker";
import { toast } from "sonner";
import { localStorageService } from "./localStorage";

// Local storage key
const WORKERS_STORAGE_KEY = "workers";

export const workerService = {
  async getAllWorkers(filter?: WorkerFilter): Promise<Worker[]> {
    try {
      // First check local storage
      const localWorkers = localStorageService.get<Worker[]>(WORKERS_STORAGE_KEY);
      
      let filteredWorkers: Worker[] = [];
      
      if (localWorkers && localWorkers.length > 0) {
        filteredWorkers = this.filterWorkers(localWorkers, filter);
        
        if (filteredWorkers.length > 0 || !filter?.siteId) {
          return filteredWorkers;
        }
      }
      
      // If no local workers or none match the filter, try Supabase
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
        console.error("Supabase error:", error);
        
        // If no local workers found, add sample workers for this site
        if (filter?.siteId && (!filteredWorkers || filteredWorkers.length === 0)) {
          const sampleWorkers = await this.addSampleWorkers(filter.siteId);
          return this.filterWorkers(sampleWorkers, filter);
        }
        
        return filteredWorkers;
      }

      if (data && data.length > 0) {
        // Update local storage with the new data
        const existingWorkers = localWorkers || [];
        const newWorkers = data as Worker[];
        
        // Merge the workers, replacing any with the same ID
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
        return this.filterWorkers(mergedWorkers, filter);
      }
      
      // If no workers found in Supabase either, add sample workers if a site ID is provided
      if (filter?.siteId && (!filteredWorkers || filteredWorkers.length === 0)) {
        const sampleWorkers = await this.addSampleWorkers(filter.siteId);
        return this.filterWorkers(sampleWorkers, filter);
      }
      
      return filteredWorkers;
    } catch (error) {
      console.error("Error in getAllWorkers:", error);
      return [];
    }
  },
  
  // Helper method to apply filters to workers
  filterWorkers(workers: Worker[], filter?: WorkerFilter): Worker[] {
    if (!filter) return workers;
    
    return workers.filter(worker => {
      // Filter by site ID
      if (filter.siteId && worker.site_id !== filter.siteId) {
        return false;
      }
      
      // Filter by status
      if (filter.status && worker.status !== filter.status) {
        return false;
      }
      
      // Filter by skill
      if (filter.skill && !worker.skills.includes(filter.skill)) {
        return false;
      }
      
      // Filter by search query
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        return (
          worker.name.toLowerCase().includes(query) ||
          worker.worker_id.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  },

  async createWorker(worker: Omit<Worker, 'id' | 'created_at' | 'updated_at'>): Promise<Worker> {
    try {
      const { data, error } = await supabase
        .from('workers')
        .insert([worker])
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      // Update local storage
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
      // First check local storage
      const localWorkers = localStorageService.get<Worker[]>(WORKERS_STORAGE_KEY);
      if (localWorkers) {
        const worker = localWorkers.find(worker => worker.id === id);
        if (worker) return worker;
      }
      
      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as Worker;
    } catch (error) {
      console.error("Failed to fetch worker:", error);
      return null;
    }
  },

  async updateWorker(id: string, worker: Partial<Worker>): Promise<Worker> {
    try {
      const { data, error } = await supabase
        .from('workers')
        .update(worker)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      // Update local storage
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
        .from('workers')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }
      
      // Update local storage
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
  },

  // Sample data generation
  async addSampleWorkers(siteId: string): Promise<Worker[]> {
    const now = new Date().toISOString();
    
    // Generate unique IDs for the workers
    const generateId = () => `worker-${Math.floor(Math.random() * 10000)}`;
    
    const sampleWorkers = [
      {
        id: generateId(),
        worker_id: "W001",
        name: "Rajesh Kumar",
        contact_number: "9876543210",
        address: "123 Main Street, Mumbai",
        skills: ["masonry", "carpentry"],
        daily_wage: 800,
        joining_date: "2025-01-15",
        site_id: siteId,
        status: "active",
        created_at: now,
        updated_at: now
      },
      {
        id: generateId(),
        worker_id: "W002",
        name: "Sunil Sharma",
        contact_number: "8765432109",
        address: "456 Park Avenue, Delhi",
        skills: ["plumbing", "electrical"],
        daily_wage: 850,
        joining_date: "2025-02-01",
        site_id: siteId,
        status: "active",
        created_at: now,
        updated_at: now
      },
      {
        id: generateId(),
        worker_id: "W003",
        name: "Priya Patel",
        contact_number: "7654321098",
        address: "789 Garden Road, Ahmedabad",
        skills: ["painting", "tiling"],
        daily_wage: 750,
        joining_date: "2025-01-20",
        site_id: siteId,
        status: "active",
        created_at: now,
        updated_at: now
      },
      {
        id: generateId(),
        worker_id: "W004",
        name: "Ankit Singh",
        contact_number: "6543210987",
        address: "234 Lake View, Pune",
        skills: ["carpentry", "flooring"],
        daily_wage: 820,
        joining_date: "2025-02-10",
        site_id: siteId,
        status: "active",
        created_at: now,
        updated_at: now
      },
      {
        id: generateId(),
        worker_id: "W005",
        name: "Neha Gupta",
        contact_number: "9876543211",
        address: "567 Hill Road, Jaipur",
        skills: ["electrical", "plumbing"],
        daily_wage: 900,
        joining_date: "2024-12-15",
        site_id: siteId,
        status: "active",
        created_at: now,
        updated_at: now
      }
    ];

    try {
      // Store in local storage first
      const existingWorkers = localStorageService.get<Worker[]>(WORKERS_STORAGE_KEY) || [];
      
      // Add new workers that don't already exist for this site
      const existingSiteWorkerIds = existingWorkers
        .filter(w => w.site_id === siteId)
        .map(w => w.worker_id);
      
      const newWorkers = sampleWorkers.filter(w => !existingSiteWorkerIds.includes(w.worker_id));
      
      if (newWorkers.length > 0) {
        const allWorkers = [...existingWorkers, ...newWorkers];
        localStorageService.set(WORKERS_STORAGE_KEY, allWorkers);
        
        // Try to store in Supabase too
        const { error } = await supabase
          .from('workers')
          .insert(newWorkers);

        if (error) {
          console.error("Error saving workers to Supabase, but local storage was updated:", error);
        }
        
        console.log(`Added ${newWorkers.length} sample workers for site ${siteId}`);
        return allWorkers.filter(w => w.site_id === siteId);
      } else {
        console.log(`Sample workers already exist for site ${siteId}`);
        return existingWorkers.filter(w => w.site_id === siteId);
      }
    } catch (error) {
      console.error("Error adding sample workers:", error);
      
      // If there was an error, but we already have the sample workers in memory,
      // store them in local storage and return them
      const existingWorkers = localStorageService.get<Worker[]>(WORKERS_STORAGE_KEY) || [];
      const mergedWorkers = [...existingWorkers, ...sampleWorkers];
      localStorageService.set(WORKERS_STORAGE_KEY, mergedWorkers);
      
      return mergedWorkers.filter(w => w.site_id === siteId);
    }
  }
};
