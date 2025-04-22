
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, UserRole } from "@/models/user";
import { localStorageService } from "./localStorage";

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

// Local storage key
const USERS_STORAGE_KEY = "users";

export const userManagementService = {
  async createUser(userData: CreateUserData) {
    try {
      // Create user in local storage
      const existingUsers = localStorageService.get<UserWithEmail[]>(USERS_STORAGE_KEY) || [];
      
      // Generate unique ID
      const id = `user-${Date.now()}`;
      
      const newUser: UserWithEmail = {
        id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        created_at: new Date().toISOString(),
        site_id: userData.siteId || null
      };
      
      // Store locally
      existingUsers.push(newUser);
      localStorageService.set(USERS_STORAGE_KEY, existingUsers);
      
      // Try Supabase only if available
      try {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            data: {
              name: userData.name,
              role: userData.role,
            },
          },
        });

        if (signUpError) {
          console.error("Supabase signup error:", signUpError);
          // Continue since we've already stored locally
        }
      } catch (supabaseError) {
        console.error("Supabase error:", supabaseError);
        // Continue since we've already stored locally
      }

      toast.success("User created successfully");
      return newUser;
    } catch (error) {
      toast.error("Failed to create user");
      console.error("User creation error:", error);
      throw error;
    }
  },

  async getAllUsers(): Promise<UserWithEmail[]> {
    try {
      // First check local storage
      const localUsers = localStorageService.get<UserWithEmail[]>(USERS_STORAGE_KEY);
      
      if (localUsers && localUsers.length > 0) {
        return localUsers;
      }
      
      // Try from Supabase if available
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          // Return empty array if no local users
          return [];
        }

        // Store in local storage for future use
        const profilesWithEmail = profiles as unknown as UserWithEmail[];
        localStorageService.set(USERS_STORAGE_KEY, profilesWithEmail);
        
        return profilesWithEmail;
      } catch (supabaseError) {
        console.error("Supabase error:", supabaseError);
        // Return empty array if no local users and Supabase fails
        return [];
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return [];
    }
  },
};
