
// Site data models

export interface Site {
  id: string;
  name: string;
  location: string;
  description?: string;
  supervisor: string;
  workersCount: number;
  status: "active" | "completed" | "paused";
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}
