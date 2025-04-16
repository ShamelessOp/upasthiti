
// Site data models

export interface Site {
  id: string;
  name: string;
  location: string;
  description?: string;
  status: "active" | "completed" | "paused";
  start_date: string;
  end_date?: string;
  supervisor_id: string;
  created_at: string;
  updated_at: string;
}

