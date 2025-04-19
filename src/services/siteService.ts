
import { Site, SiteStatus, CreateSiteInput, UpdateSiteInput } from "@/models/site";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { authService } from "./authService";
import { localStorageService } from "./localStorage";

// Local storage keys
const SITES_STORAGE_KEY = "sites";

export const siteService = {
  // Get all sites
  async getAllSites(): Promise<Site[]> {
    try {
      // First check local storage for sites
      const localSites = localStorageService.get<Site[]>(SITES_STORAGE_KEY);
      
      if (localSites && localSites.length > 0) {
        return localSites;
      }
      
      // If no local sites, try to get from Supabase
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        
        // If Supabase fails, add sample sites
        const sampleSites = await this.addSampleSites();
        return sampleSites;
      }

      if (data && data.length > 0) {
        // Store in local storage
        localStorageService.set(SITES_STORAGE_KEY, data);
        return data as Site[];
      }
      
      // If no data, add sample sites
      const sampleSites = await this.addSampleSites();
      return sampleSites;
    } catch (error) {
      console.error("Error in getAllSites:", error);
      const sampleSites = await this.addSampleSites();
      return sampleSites;
    }
  },

  // Get site by ID
  async getSiteById(id: string): Promise<Site | null> {
    try {
      // First check local storage
      const localSites = localStorageService.get<Site[]>(SITES_STORAGE_KEY);
      if (localSites) {
        const site = localSites.find(site => site.id === id);
        if (site) return site;
      }
      
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data as unknown as Site;
    } catch (error) {
      console.error("Failed to retrieve site:", error);
      return null;
    }
  },

  // Create new site
  async createSite(siteData: CreateSiteInput): Promise<Site | null> {
    // Get the current user from auth service
    const user = authService.getCurrentUser();
    
    if (!user) {
      // Try to auto-login if not authenticated
      await authService.autoLogin();
      
      // Check again
      const autologgedUser = authService.getCurrentUser();
      if (!autologgedUser) {
        toast.error("User not authenticated");
        throw new Error("User not authenticated");
      }
    }

    const currentUser = authService.getCurrentUser();
    
    const newSite = {
      ...siteData,
      supervisor_id: currentUser?.id || "1", // Use default admin ID if all else fails
      status: siteData.status || 'active' as SiteStatus
    };

    try {
      const { data, error } = await supabase
        .from('sites')
        .insert([newSite])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local storage
      const localSites = localStorageService.get<Site[]>(SITES_STORAGE_KEY) || [];
      localSites.push(data as unknown as Site);
      localStorageService.set(SITES_STORAGE_KEY, localSites);
      
      toast.success("Site created successfully");
      return data as unknown as Site;
    } catch (error) {
      console.error("Failed to create site:", error);
      toast.error("Failed to create site");
      return null;
    }
  },

  // Update site
  async updateSite(id: string, siteData: UpdateSiteInput): Promise<Site | null> {
    try {
      const { data, error } = await supabase
        .from('sites')
        .update(siteData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      // Update local storage
      const localSites = localStorageService.get<Site[]>(SITES_STORAGE_KEY) || [];
      const updatedSites = localSites.map(site => 
        site.id === id ? { ...site, ...siteData } : site
      );
      localStorageService.set(SITES_STORAGE_KEY, updatedSites);

      toast.success("Site updated successfully");
      return data as unknown as Site;
    } catch (error) {
      console.error("Failed to update site:", error);
      toast.error("Failed to update site");
      return null;
    }
  },

  // Delete site
  async deleteSite(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local storage
      const localSites = localStorageService.get<Site[]>(SITES_STORAGE_KEY) || [];
      const filteredSites = localSites.filter(site => site.id !== id);
      localStorageService.set(SITES_STORAGE_KEY, filteredSites);
      
      toast.success("Site deleted successfully");
      return true;
    } catch (error) {
      console.error("Failed to delete site:", error);
      toast.error("Failed to delete site");
      return false;
    }
  },

  // Add sample sites
  async addSampleSites(): Promise<Site[]> {
    const user = authService.getCurrentUser();
    
    if (!user) {
      await authService.autoLogin();
    }
    
    const currentUser = authService.getCurrentUser();
    const userId = currentUser?.id || "1";

    const now = new Date().toISOString();
    
    const sampleSites = [
      {
        id: "site-1",
        name: "Sapphire Heights",
        location: "Powai, Mumbai",
        description: "Luxury apartment complex with 4 towers",
        status: "active" as SiteStatus,
        start_date: "2025-01-10",
        end_date: "2025-12-15",
        supervisor_id: userId,
        created_at: now,
        updated_at: now
      },
      {
        id: "site-2",
        name: "Green Valley Villas",
        location: "Whitefield, Bangalore",
        description: "Eco-friendly gated community with 25 villas",
        status: "active" as SiteStatus,
        start_date: "2025-02-05",
        end_date: "2025-09-30",
        supervisor_id: userId,
        created_at: now,
        updated_at: now
      },
      {
        id: "site-3",
        name: "Metro Business Park",
        location: "Gurgaon, Delhi NCR",
        description: "Commercial office complex with 3 buildings",
        status: "active" as SiteStatus,
        start_date: "2025-03-20",
        supervisor_id: userId,
        created_at: now,
        updated_at: now
      },
      {
        id: "site-4",
        name: "Heritage Restoration",
        location: "Fort Area, Jaipur",
        description: "Historical building restoration project",
        status: "paused" as SiteStatus,
        start_date: "2024-12-01",
        end_date: "2025-08-15",
        supervisor_id: userId,
        created_at: now,
        updated_at: now
      }
    ];

    try {
      // Store in local storage first
      localStorageService.set(SITES_STORAGE_KEY, sampleSites);
      
      // Try to store in Supabase too
      const { data, error } = await supabase
        .from('sites')
        .insert(sampleSites)
        .select();

      if (error) {
        console.error("Error saving to Supabase, but local storage was updated:", error);
      }

      console.log("Sample sites added successfully");
      return sampleSites;
    } catch (error) {
      console.error("Error adding sample sites:", error);
      // Still return the sample sites even if there was an error with Supabase
      return sampleSites;
    }
  }
};
