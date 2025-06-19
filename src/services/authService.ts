
import { User, UserCredentials, UserRegistration, UserRole } from "@/models/user";
import { supabase } from "@/integrations/supabase/client";

export const authService = {
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },

  // Get current authenticated user from Supabase session
  getCurrentUser(): User | null {
    // This will be managed by AuthContext, return null here
    // The AuthContext will handle the session state
    return null;
  },

  // Login user with Supabase
  async login(credentials: UserCredentials): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Check if email is confirmed
        if (!data.user.email_confirmed_at) {
          throw new Error("Please check your email and click the confirmation link before logging in.");
        }

        // Create user object from Supabase user
        const user: User = {
          id: data.user.id,
          name: data.user.user_metadata.name || data.user.email?.split('@')[0] || '',
          email: data.user.email || '',
          role: data.user.user_metadata.role || 'siteManager',
          createdAt: data.user.created_at,
          lastLogin: new Date().toISOString()
        };
        
        return user;
      }
      
      return null;
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed");
    }
  },

  // Register new user with Supabase
  async register(userData: UserRegistration): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        const user: User = {
          id: data.user.id,
          name: data.user.user_metadata.name || '',
          email: data.user.email || '',
          role: data.user.user_metadata.role || userData.role,
          createdAt: data.user.created_at,
          lastLogin: new Date().toISOString()
        };
        
        return user;
      }
      
      return null;
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.message || "Registration failed");
    }
  },

  // Logout user
  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  // Check if user has specific role
  hasRole(role: UserRole | UserRole[]): boolean {
    // This will be handled by AuthContext
    return false;
  },

  // Get authentication token
  getToken(): string | null {
    // Handled by Supabase automatically
    return null;
  }
};
