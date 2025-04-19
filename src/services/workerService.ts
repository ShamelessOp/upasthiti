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
  },

  async getWorkerById(id: string): Promise<Worker | null> {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error("Failed to fetch worker: " + error.message);
      throw error;
    }

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
  },

  // Sample data generation
  async addSampleWorkers(siteId: string): Promise<Worker[]> {
    const sampleWorkers = [
      {
        worker_id: "W001",
        name: "Rajesh Kumar",
        contact_number: "9876543210",
        address: "123 Main Street, Mumbai",
        skills: ["masonry", "carpentry"],
        daily_wage: 800,
        joining_date: "2025-01-15",
        site_id: siteId,
        status: "active"
      },
      {
        worker_id: "W002",
        name: "Sunil Sharma",
        contact_number: "8765432109",
        address: "456 Park Avenue, Delhi",
        skills: ["plumbing", "electrical"],
        daily_wage: 850,
        joining_date: "2025-02-01",
        site_id: siteId,
        status: "active"
      },
      {
        worker_id: "W003",
        name: "Priya Patel",
        contact_number: "7654321098",
        address: "789 Garden Road, Ahmedabad",
        skills: ["painting", "tiling"],
        daily_wage: 750,
        joining_date: "2025-01-20",
        site_id: siteId,
        status: "active"
      },
      {
        worker_id: "W004",
        name: "Ankit Singh",
        contact_number: "6543210987",
        address: "234 Lake View, Pune",
        skills: ["carpentry", "flooring"],
        daily_wage: 820,
        joining_date: "2025-02-10",
        site_id: siteId,
        status: "active"
      },
      {
        worker_id: "W005",
        name: "Neha Gupta",
        contact_number: "9876543211",
        address: "567 Hill Road, Jaipur",
        skills: ["electrical", "plumbing"],
        daily_wage: 900,
        joining_date: "2024-12-15",
        site_id: siteId,
        status: "active"
      },
      {
        worker_id: "W006",
        name: "Vikram Malhotra",
        contact_number: "8765432108",
        address: "890 River Lane, Chennai",
        skills: ["masonry", "concrete"],
        daily_wage: 830,
        joining_date: "2025-01-05",
        site_id: siteId,
        status: "active"
      },
      {
        worker_id: "W007",
        name: "Sanjay Verma",
        contact_number: "7654321097",
        address: "123 Tree Avenue, Kolkata",
        skills: ["plastering", "painting"],
        daily_wage: 780,
        joining_date: "2024-12-20",
        site_id: siteId,
        status: "active"
      },
      {
        worker_id: "W008",
        name: "Deepak Joshi",
        contact_number: "6543210986",
        address: "456 Cloud Street, Hyderabad",
        skills: ["flooring", "tiling"],
        daily_wage: 810,
        joining_date: "2024-12-10",
        site_id: siteId,
        status: "active"
      },
      {
        worker_id: "W009",
        name: "Anjali Desai",
        contact_number: "9876543212",
        address: "789 Sun Road, Bengaluru",
        skills: ["electrical", "hvac"],
        daily_wage: 880,
        joining_date: "2025-02-15",
        site_id: siteId,
        status: "active"
      },
      {
        worker_id: "W010",
        name: "Ramesh Patel",
        contact_number: "8765432107",
        address: "234 Moon Street, Nagpur",
        skills: ["carpentry", "masonry"],
        daily_wage: 840,
        joining_date: "2025-01-25",
        site_id: siteId,
        status: "active"
      },
      {
        worker_id: "W011",
        name: "Arjun Singh",
        contact_number: "7654321096",
        address: "567 Star Avenue, Lucknow",
        skills: ["plumbing", "welding"],
        daily_wage: 860,
        joining_date: "2024-12-25",
        site_id: siteId,
        status: "active"
      },
      {
        worker_id: "W012",
        name: "Pooja Sharma",
        contact_number: "6543210985",
        address: "890 Planet Road, Indore",
        skills: ["painting", "insulation"],
        daily_wage: 790,
        joining_date: "2025-02-05",
        site_id: siteId,
        status: "active"
      },
      {
        worker_id: "W013",
        name: "Mohan Das",
        contact_number: "9876543213",
        address: "123 Galaxy Lane, Surat",
        skills: ["carpentry", "glazing"],
        daily_wage: 870,
        joining_date: "2025-01-10",
        site_id: siteId,
        status: "active"
      }
    ];

    try {
      const { data, error } = await supabase
        .from('workers')
        .insert(sampleWorkers)
        .select();

      if (error) {
        toast.error("Failed to add sample workers: " + error.message);
        throw error;
      }

      toast.success("Sample workers added successfully");
      return data as Worker[];
    } catch (error) {
      console.error("Error adding sample workers:", error);
      throw error;
    }
  }
};
