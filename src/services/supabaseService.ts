import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export class SupabaseService {
  // Generic CRUD operations
  async create<T>(table: string, data: any): Promise<T | null> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) {
        console.error(`Error creating ${table}:`, error);
        toast.error(`Failed to create ${table}`);
        return null;
      }

      return result as T;
    } catch (error) {
      console.error(`Failed to create ${table}:`, error);
      toast.error(`Failed to create ${table}`);
      return null;
    }
  }

  async read<T>(table: string, filters?: any): Promise<T[]> {
    try {
      let query = supabase.from(table).select('*');
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error(`Error reading ${table}:`, error);
        return [];
      }

      return data as T[];
    } catch (error) {
      console.error(`Failed to read ${table}:`, error);
      return [];
    }
  }

  async update<T>(table: string, id: string, data: any): Promise<T | null> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Error updating ${table}:`, error);
        toast.error(`Failed to update ${table}`);
        return null;
      }

      return result as T;
    } catch (error) {
      console.error(`Failed to update ${table}:`, error);
      toast.error(`Failed to update ${table}`);
      return null;
    }
  }

  async delete(table: string, id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Error deleting ${table}:`, error);
        toast.error(`Failed to delete ${table}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Failed to delete ${table}:`, error);
      toast.error(`Failed to delete ${table}`);
      return false;
    }
  }

  // Real-time subscription helper
  subscribeToTable(table: string, callback: (payload: any) => void) {
    return supabase
      .channel(`${table}-changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table }, 
        callback
      )
      .subscribe();
  }
}

export const supabaseService = new SupabaseService();