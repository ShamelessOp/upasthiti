
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/models/user";
import { authService } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";

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
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        if (session && session.user) {
          setUser(session.user as unknown as User);
          localStorage.setItem("user", JSON.stringify(session.user));
          localStorage.setItem("token", session.access_token);
        } else {
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user) {
        console.log("Existing session found:", session.user);
        setUser(session.user as unknown as User);
        localStorage.setItem("user", JSON.stringify(session.user));
        localStorage.setItem("token", session.access_token);
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
      const loggedInUser = await authService.login({ email, password });
      setUser(loggedInUser);
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    try {
      const newUser = await authService.register({ name, email, password, role });
      setUser(newUser);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
