
import { Site, SiteStatus, CreateSiteInput, UpdateSiteInput } from "@/models/site";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const siteService = {
  // Get all sites from Supabase
  async getAllSites(): Promise<Site[]> {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching sites:", error);
        toast.error("Failed to fetch sites");
        return [];
      }

      return data as Site[];
    } catch (error) {
      console.error("Error in getAllSites:", error);
      toast.error("Failed to fetch sites");
      return [];
    }
  },

  // Get site by ID from Supabase
  async getSiteById(id: string): Promise<Site | null> {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching site:", error);
        return null;
      }

      return data as Site;
    } catch (error) {
      console.error("Failed to retrieve site:", error);
      return null;
    }
  },

  // Create new site in Supabase
  async createSite(siteData: CreateSiteInput): Promise<Site | null> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("User not authenticated");
        return null;
      }

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
        console.error("Error creating site:", error);
        toast.error("Failed to create site");
        return null;
      }

      toast.success("Site created successfully");
      return data as Site;
    } catch (error) {
      console.error("Failed to create site:", error);
      toast.error("Failed to create site");
      return null;
    }
  },

  // Update site in Supabase
  async updateSite(id: string, siteData: UpdateSiteInput): Promise<Site | null> {
    try {
      const { data, error } = await supabase
        .from('sites')
        .update(siteData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error("Error updating site:", error);
        toast.error("Failed to update site");
        return null;
      }

      toast.success("Site updated successfully");
      return data as Site;
    } catch (error) {
      console.error("Failed to update site:", error);
      toast.error("Failed to update site");
      return null;
    }
  },

  // Delete site from Supabase
  async deleteSite(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error deleting site:", error);
        toast.error("Failed to delete site");
        return false;
      }

      toast.success("Site deleted successfully");
      return true;
    } catch (error) {
      console.error("Failed to delete site:", error);
      toast.error("Failed to delete site");
      return false;
    }
  }
};
