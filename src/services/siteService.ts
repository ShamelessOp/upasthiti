
import { Site, SiteStatus, CreateSiteInput, UpdateSiteInput } from "@/models/site";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const siteService = {
  // Get all sites
  async getAllSites(): Promise<Site[]> {
    console.log("Fetching all sites");
    
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Site fetch error:", error);
      toast.error("Failed to retrieve sites: " + error.message);
      throw error;
    }

    console.log("Sites fetched:", data);
    return (data as unknown as Site[]) || [];
  },

  // Get site by ID
  async getSiteById(id: string): Promise<Site | null> {
    console.log("Fetching site with ID:", id);
    
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Site fetch error:", error);
      toast.error("Failed to retrieve site: " + error.message);
      throw error;
    }

    console.log("Site fetched:", data);
    return data as unknown as Site;
  },

  // Create new site
  async createSite(siteData: CreateSiteInput): Promise<Site | null> {
    console.log("Creating new site:", siteData);
    
    // First check if the user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      console.error("User not authenticated - Session state:", !!session, "User state:", !!session?.user);
      // Check if user is in local storage as a fallback
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      
      if (!storedUser || !storedToken) {
        toast.error("You must be logged in to create a site");
        throw new Error("User not authenticated");
      }
      
      // Use the stored user ID
      try {
        const user = JSON.parse(storedUser);
        const newSite = {
          ...siteData,
          supervisor_id: user.id,
          status: siteData.status || 'active' as SiteStatus
        };

        const { data, error } = await supabase
          .from('sites')
          .insert([newSite])
          .select()
          .single();

        if (error) {
          console.error("Site creation error:", error);
          toast.error("Failed to create site: " + error.message);
          throw error;
        }

        console.log("Site created:", data);
        toast.success("Site created successfully");
        return data as unknown as Site;
      } catch (e) {
        console.error("Error using stored user:", e);
        toast.error("Authentication error. Please log in again.");
        throw new Error("User not authenticated");
      }
    }

    const newSite = {
      ...siteData,
      supervisor_id: session.user.id,
      status: siteData.status || 'active' as SiteStatus
    };

    console.log("Creating site with supervisor ID:", newSite.supervisor_id);

    const { data, error } = await supabase
      .from('sites')
      .insert([newSite])
      .select()
      .single();

    if (error) {
      console.error("Site creation error:", error);
      toast.error("Failed to create site: " + error.message);
      throw error;
    }

    console.log("Site created:", data);
    toast.success("Site created successfully");
    return data as unknown as Site;
  },

  // Update site
  async updateSite(id: string, siteData: UpdateSiteInput): Promise<Site | null> {
    console.log("Updating site with ID:", id, "Data:", siteData);
    
    const { data, error } = await supabase
      .from('sites')
      .update(siteData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Site update error:", error);
      toast.error("Failed to update site: " + error.message);
      throw error;
    }

    console.log("Site updated:", data);
    toast.success("Site updated successfully");
    return data as unknown as Site;
  },

  // Delete site
  async deleteSite(id: string): Promise<boolean> {
    console.log("Deleting site with ID:", id);
    
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Site deletion error:", error);
      toast.error("Failed to delete site: " + error.message);
      throw error;
    }

    console.log("Site deleted successfully");
    toast.success("Site deleted successfully");
    return true;
  }
};
