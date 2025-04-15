
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

  async getAllUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Failed to fetch users: " + error.message);
      throw error;
    }

    return data;
  },
};
