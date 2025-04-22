
// Worker data models

export interface Worker {
  id: string;
  worker_id: string;
  name: string;
  contact_number: string;
  address?: string;
  skills: string[];
  daily_wage: number;
  joining_date: string;
  site_id: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface WorkerFilter {
  siteId?: string;
  searchQuery?: string;
  status?: "active" | "inactive";
  skill?: string;
}

// Add the WorkerStatus type that's missing
export type WorkerStatus = "active" | "inactive";
