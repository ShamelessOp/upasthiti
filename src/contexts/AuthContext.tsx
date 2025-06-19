
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session ? session.user?.email : 'No user');
        
        if (session?.user) {
          // Check if email is confirmed
          if (!session.user.email_confirmed_at) {
            console.log('Email not confirmed, user cannot access app');
            setUser(null);
            setLoading(false);
            return;
          }

          // Get or create user profile
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
          }

          const currentUser: User = {
            id: session.user.id,
            name: profile?.name || session.user.user_metadata.name || session.user.email?.split('@')[0] || '',
            email: session.user.email || '',
            role: profile?.role || session.user.user_metadata.role || 'siteManager',
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
      if (!session) {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const result = await authService.login({ email, password });
      if (result) {
        toast.success("Login successful!");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      // Re-throw error so Login component can handle it
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    try {
      const result = await authService.register({ name, email, password, role });
      if (result) {
        // Don't show success toast here, let the Signup component handle it
        console.log("Signup successful, confirmation email sent");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      // Re-throw error so Signup component can handle it
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    await authService.logout();
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
