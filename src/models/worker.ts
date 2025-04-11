
// Worker data models

export interface Worker {
  id: string;
  workerId: string;
  name: string;
  contactNumber: string;
  address?: string;
  skills: string[];
  dailyWage: number;
  joiningDate: string;
  siteId: string;
  siteName: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface WorkerFilter {
  siteId?: string;
  searchQuery?: string;
  status?: "active" | "inactive";
  skill?: string;
}
