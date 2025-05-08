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

  // Check for existing session and set up auth state change listener
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          const currentUser: User = {
            id: session.user.id,
            name: session.user.user_metadata.name || session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            role: session.user.user_metadata.role || 'siteManager',
            createdAt: session.user.created_at,
            lastLogin: new Date().toISOString()
          };
          setUser(currentUser);
          
          // Store in localStorage for compatibility
          authService.updateLocalUser(currentUser);
        } else {
          setUser(null);
          authService.clearLocalUser();
        }
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const currentUser: User = {
          id: session.user.id,
          name: session.user.user_metadata.name || session.user.email?.split('@')[0] || '',
          email: session.user.email || '',
          role: session.user.user_metadata.role || 'siteManager',
          createdAt: session.user.created_at,
          lastLogin: new Date().toISOString()
        };
        setUser(currentUser);
        
        // Store in localStorage for compatibility
        authService.updateLocalUser(currentUser);
      } else {
        // Try auto-login for demo purposes
        authService.autoLogin().then(user => {
          setUser(user);
        }).catch(() => {
          // Auto-login failed, keep user as null
          setUser(null);
        }).finally(() => {
          setLoading(false);
        });
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
      // First try Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // Fall back to mock auth for demo purposes
        const loggedInUser = await authService.login({ email, password });
        setUser(loggedInUser);
      } else if (data.user) {
        const currentUser: User = {
          id: data.user.id,
          name: data.user.user_metadata.name || data.user.email?.split('@')[0] || '',
          email: data.user.email || '',
          role: data.user.user_metadata.role || 'siteManager',
          createdAt: data.user.created_at,
          lastLogin: new Date().toISOString()
        };
        
        setUser(currentUser);
        
        // Store in localStorage for compatibility
        authService.updateLocalUser(currentUser);
        toast.success("Login successful!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    try {
      // First try Supabase auth
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
        // Fall back to mock auth for demo purposes
        const newUser = await authService.register({ name, email, password, role });
        setUser(newUser);
      } else if (data.user) {
        const currentUser: User = {
          id: data.user.id,
          name: data.user.user_metadata.name || '',
          email: data.user.email || '',
          role: data.user.user_metadata.role || role,
          createdAt: data.user.created_at,
          lastLogin: new Date().toISOString()
        };
        
        setUser(currentUser);
        
        // Store in localStorage for compatibility
        authService.updateLocalUser(currentUser);
        toast.success("Account created successfully!");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Also clear local storage
    authService.logout();
    setUser(null);
    toast.success("Successfully logged out");
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
