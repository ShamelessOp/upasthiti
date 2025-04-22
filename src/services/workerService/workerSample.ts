import { supabase } from "@/integrations/supabase/client";
import { Worker } from "@/models/worker";
import { localStorageService } from "../localStorage";

const WORKERS_STORAGE_KEY = "workers";

export async function addSampleWorkers(siteId: string): Promise<Worker[]> {
  const now = new Date().toISOString();
  const generateId = () => `worker-${Math.floor(Math.random() * 10000)}`;
  const sampleWorkers: Worker[] = [
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
    const existingWorkers = localStorageService.get<Worker[]>(WORKERS_STORAGE_KEY) || [];
    const existingSiteWorkerIds = existingWorkers
      .filter(w => w.site_id === siteId)
      .map(w => w.worker_id);
    const newWorkers = sampleWorkers.filter(w => !existingSiteWorkerIds.includes(w.worker_id));
    if (newWorkers.length > 0) {
      const allWorkers = [...existingWorkers, ...newWorkers];
      localStorageService.set(WORKERS_STORAGE_KEY, allWorkers);
      try {
        const { error } = await supabase.from("workers").insert(newWorkers);
        if (error) {
          console.error("Error saving workers to Supabase, but local storage was updated:", error);
        }
      } catch (supabaseError) {
        console.error("Supabase error:", supabaseError);
      }
      return allWorkers.filter(w => w.site_id === siteId);
    } else {
      return existingWorkers.filter(w => w.site_id === siteId);
    }
  } catch (error) {
    console.error("Error adding sample workers:", error);
    const existingWorkers = localStorageService.get<Worker[]>(WORKERS_STORAGE_KEY) || [];
    const mergedWorkers = [...existingWorkers, ...sampleWorkers];
    localStorageService.set(WORKERS_STORAGE_KEY, mergedWorkers);
    return mergedWorkers.filter(w => w.site_id === siteId);
  }
}
