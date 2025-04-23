
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/models/user";
import { authService } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for existing session on mount and set up auth listener
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          const currentUser: User = {
            id: session.user.id,
            name: session.user.user_metadata?.name || "User",
            email: session.user.email || "",
            role: (session.user.user_metadata?.role as UserRole) || "siteManager",
            createdAt: session.user.created_at,
            lastLogin: new Date().toISOString()
          };
          setUser(currentUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const currentUser: User = {
          id: session.user.id,
          name: session.user.user_metadata?.name || "User",
          email: session.user.email || "",
          role: (session.user.user_metadata?.role as UserRole) || "siteManager",
          createdAt: session.user.created_at,
          lastLogin: new Date().toISOString()
        };
        setUser(currentUser);
      }
      setLoading(false);
    });

    // Fallback to mock auth for development if no Supabase session
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        if (!user) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
          setLoading(false);
        }
      }, 1000);
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // First try Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // Fall back to mock auth system for development
        if (process.env.NODE_ENV === 'development') {
          const loggedInUser = await authService.login({ email, password });
          setUser(loggedInUser);
          return;
        }
        throw error;
      }

      if (data.user) {
        // User is already set by the auth state listener
        toast.success("Successfully logged in");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    try {
      // Create user in Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });
      
      if (error) {
        // Fall back to mock auth system for development
        if (process.env.NODE_ENV === 'development') {
          const newUser = await authService.register({ name, email, password, role });
          setUser(newUser);
          return;
        }
        throw error;
      }

      if (data.user) {
        // User is already set by the auth state listener
        toast.success("Account created successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "Sign up failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      toast.success("Successfully logged out");
    } catch (error) {
      // Fall back to mock auth system for development
      authService.logout();
      setUser(null);
    }
  };

  const isAdmin = user?.role === "admin" || user?.email === "admin@upastithi.com";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
