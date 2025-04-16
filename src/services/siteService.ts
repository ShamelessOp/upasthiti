
import { Site, SiteStatus, CreateSiteInput, UpdateSiteInput } from "@/models/site";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const siteService = {
  // Get all sites
  async getAllSites(): Promise<Site[]> {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to retrieve sites: " + error.message);
      throw error;
    }

    // Cast the status to ensure it matches the SiteStatus type
    return (data as unknown as Site[]) || [];
  },

  // Get site by ID
  async getSiteById(id: string): Promise<Site | null> {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error("Failed to retrieve site: " + error.message);
      throw error;
    }

    // Cast the data to Site type
    return data as unknown as Site;
  },

  // Create new site
  async createSite(siteData: CreateSiteInput): Promise<Site | null> {
    const user = (await supabase.auth.getUser()).data.user;
    
    if (!user) {
      toast.error("User not authenticated");
      throw new Error("User not authenticated");
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
      toast.error("Failed to create site: " + error.message);
      throw error;
    }

    toast.success("Site created successfully");
    return data as unknown as Site;
  },

  // Update site
  async updateSite(id: string, siteData: UpdateSiteInput): Promise<Site | null> {
    const { data, error } = await supabase
      .from('sites')
      .update(siteData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast.error("Failed to update site: " + error.message);
      throw error;
    }

    toast.success("Site updated successfully");
    return data as unknown as Site;
  },

  // Delete site
  async deleteSite(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete site: " + error.message);
      throw error;
    }

    toast.success("Site deleted successfully");
    return true;
  }
};
