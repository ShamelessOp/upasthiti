
import { User, UserCredentials, UserRegistration, UserRole } from "@/models/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Local storage keys
const USER_STORAGE_KEY = "user";
const TOKEN_STORAGE_KEY = "token";

export const authService = {
  // Check if user is authenticated
  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return !!user;
  },

  // Get current authenticated user
  getCurrentUser(): User | null {
    // First try to get from localStorage for quick access
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      return JSON.parse(storedUser);
    }

    // Then check Supabase session - this method is synchronous
    // We can't await here since this method is synchronous
    // Instead we'll just return null and let the auth state listener handle updating the user
    return null;
  },

  // Login user
  async login(credentials: UserCredentials): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        toast.error("Login failed: " + error.message);
        throw error;
      }

      if (data && data.user) {
        // Store user in local storage for quick access
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        localStorage.setItem(TOKEN_STORAGE_KEY, data.session?.access_token || '');
        
        toast.success("Successfully logged in");
        return data.user as unknown as User;
      }

      return null;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Register new user
  async register(userData: UserRegistration): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role
          }
        }
      });

      if (error) {
        toast.error("Registration failed: " + error.message);
        throw error;
      }

      if (data && data.user) {
        // Store user in local storage for quick access
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        if (data.session) {
          localStorage.setItem(TOKEN_STORAGE_KEY, data.session.access_token);
        }
        
        toast.success("Account created successfully");
        return data.user as unknown as User;
      }

      return null;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  // Logout user
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error("Logout failed: " + error.message);
      throw error;
    }
    
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    toast.success("Successfully logged out");
  },

  // Check if user has specific role
  hasRole(role: UserRole | UserRole[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  },

  // Get authentication token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }
};
