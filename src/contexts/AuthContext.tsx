
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

  // Set up auth state listener
  useEffect(() => {
    // First try to get user from local storage for immediate UI update
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem("user");
      }
    }

    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        if (session && session.user) {
          console.log("User authenticated:", session.user.email);
          const userData = session.user as unknown as User;
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("token", session.access_token);
          
          // Make sure we're not in a loading state
          setLoading(false);
        } else {
          console.log("User not authenticated");
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        console.log("Existing session found for:", session.user.email);
        setUser(session.user as unknown as User);
        localStorage.setItem("user", JSON.stringify(session.user));
        localStorage.setItem("token", session.access_token);
      } else {
        console.log("No existing session found");
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      console.log("Login attempt for:", email);
      const loggedInUser = await authService.login({ email, password });
      setUser(loggedInUser);
    } catch (error) {
      console.error("Login error in context:", error);
      throw error; // Re-throw to be handled by the component
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    try {
      console.log("Signup attempt for:", email);
      const newUser = await authService.register({ name, email, password, role });
      setUser(newUser);
    } catch (error) {
      console.error("Signup error in context:", error);
      throw error; // Re-throw to be handled by the component
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear user state even if logout fails on API
      setUser(null);
    }
  };

  const isAuthenticated = !!user;
  console.log("AuthContext state:", { isAuthenticated, user: user?.email, loading });

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
