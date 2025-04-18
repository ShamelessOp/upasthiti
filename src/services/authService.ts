
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
      try {
        return JSON.parse(storedUser);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        return null;
      }
    }
    return null;
  },

  // Login user
  async login(credentials: UserCredentials): Promise<User | null> {
    try {
      console.log("Attempting to login with email:", credentials.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error("Login failed:", error.message);
        toast.error("Login failed: " + error.message);
        throw new Error(error.message);
      }

      if (data && data.user) {
        console.log("Login successful:", data.user.email);
        // Store user in local storage for quick access
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        
        if (data.session) {
          localStorage.setItem(TOKEN_STORAGE_KEY, data.session.access_token);
        }
        
        toast.success("Successfully logged in");
        return data.user as unknown as User;
      }

      throw new Error("No user data returned from authentication");
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to login. Please try again.");
    }
  },

  // Register new user
  async register(userData: UserRegistration): Promise<User | null> {
    try {
      console.log("Attempting to register user:", userData.email);
      
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
        console.error("Registration failed:", error.message);
        toast.error("Registration failed: " + error.message);
        throw new Error(error.message);
      }

      if (data && data.user) {
        console.log("Registration successful:", data.user.email);
        // Store user in local storage for quick access
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
        
        if (data.session) {
          localStorage.setItem(TOKEN_STORAGE_KEY, data.session.access_token);
        }
        
        toast.success("Account created successfully");
        return data.user as unknown as User;
      }

      throw new Error("No user data returned from registration");
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to register. Please try again.");
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout failed:", error.message);
        toast.error("Logout failed: " + error.message);
        throw error;
      }
      
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      toast.success("Successfully logged out");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
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
