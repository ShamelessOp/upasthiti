
import { supabase } from "@/integrations/supabase/client";
import { Site } from "@/models/site";
import { toast } from "sonner";

interface CreateSiteData {
  name: string;
  location: string;
  description?: string;
  startDate: string;
  endDate?: string;
  status: "active" | "completed" | "paused";
}

export const siteService = {
  async createSite(siteData: CreateSiteData) {
    const { data, error } = await supabase
      .from('sites')
      .insert({
        name: siteData.name,
        location: siteData.location,
        description: siteData.description,
        start_date: siteData.startDate,
        end_date: siteData.endDate,
        status: siteData.status,
        supervisor_id: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create site: " + error.message);
      throw error;
    }

    toast.success("Site created successfully");
    return data;
  },

  async getAllSites() {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to fetch sites: " + error.message);
      throw error;
    }

    return data;
  },

  async getSiteById(id: string) {
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error("Failed to fetch site: " + error.message);
      throw error;
    }

    return data;
  },
};
