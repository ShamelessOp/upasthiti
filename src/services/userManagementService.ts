
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, UserRole } from "@/models/user";

interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  siteId?: string;
}

// Extended user interface to include email from auth.users
interface UserWithEmail {
  id: string;
  name: string;
  role: string;
  email: string;
  created_at: string;
  site_id?: string | null;
}

export const userManagementService = {
  async createUser(userData: CreateUserData) {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
          created_by: (await supabase.auth.getUser()).data.user?.id,
        },
      },
    });

    if (signUpError) {
      toast.error("Failed to create user: " + signUpError.message);
      throw signUpError;
    }

    toast.success("User created successfully");
    return authData;
  },

  async getAllUsers(): Promise<UserWithEmail[]> {
    // Get profiles from the profiles table
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to fetch users: " + error.message);
      throw error;
    }

    // For each profile, we need to get the corresponding email
    // Since we can't join with auth.users directly, we'll need to adapt our UI approach
    // We'll modify the UI to show name instead of email
    
    // Cast the data to include the email property for UI compatibility
    // In a production app, you might want to handle this differently
    return profiles as unknown as UserWithEmail[];
  },
};
