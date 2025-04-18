
import { User, UserCredentials, UserRegistration, UserRole } from "@/models/user";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Local storage keys
const USER_STORAGE_KEY = "user";
const TOKEN_STORAGE_KEY = "token";

export const authService = {
  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    const user = this.getCurrentUser();
    return !!(token && user);
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
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
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

      if (!data || !data.user) {
        toast.error("No user data returned from authentication");
        throw new Error("No user data returned from authentication");
      }

      console.log("Login successful:", data.user.email);
      
      // Store user in local storage for quick access
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      
      if (data.session) {
        localStorage.setItem(TOKEN_STORAGE_KEY, data.session.access_token);
      } else {
        throw new Error("No session returned from authentication");
      }
      
      toast.success("Successfully logged in");
      return data.user as unknown as User;
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

      if (!data || !data.user) {
        toast.error("No user data returned from registration");
        throw new Error("No user data returned from registration");
      }

      console.log("Registration successful:", data.user.email);
      
      // Store user in local storage for quick access
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      
      if (data.session) {
        localStorage.setItem(TOKEN_STORAGE_KEY, data.session.access_token);
      }
      
      toast.success("Account created successfully");
      return data.user as unknown as User;
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
  },
  
  // Verify current session
  async verifySession(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session verification failed:", error.message);
        return false;
      }
      
      const hasValidSession = !!(data && data.session);
      
      if (!hasValidSession) {
        // Clear localStorage if session is invalid
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
      
      return hasValidSession;
    } catch (error) {
      console.error("Session verification error:", error);
      return false;
    }
  }
};
