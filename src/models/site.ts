
// Site data models

export type SiteStatus = "active" | "completed" | "paused";

export interface Site {
  id: string;
  name: string;
  location: string;
  description?: string;
  status: SiteStatus;
  start_date: string;
  end_date?: string;
  supervisor_id: string;
  created_at: string;
  updated_at: string;
}

// Interface for creating a new site
export interface CreateSiteInput {
  name: string;
  location: string;
  description?: string;
  status?: SiteStatus;
  start_date: string;
  end_date?: string;
}

// Interface for updating a site
export interface UpdateSiteInput {
  name?: string;
  location?: string;
  description?: string;
  status?: SiteStatus;
  start_date?: string;
  end_date?: string;
}
