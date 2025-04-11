
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// Define user roles
export type UserRole = "supervisor" | "siteManager" | "admin";

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

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

// Mock user data for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@upastithi.com",
    password: "password123",
    role: "admin" as UserRole,
  },
  {
    id: "2",
    name: "Site Manager",
    email: "manager@upastithi.com",
    password: "password123",
    role: "siteManager" as UserRole,
  },
  {
    id: "3",
    name: "Site Supervisor",
    email: "supervisor@upastithi.com",
    password: "password123",
    role: "supervisor" as UserRole,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("upastithi_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("upastithi_user");
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email and password (in a real app, this would be an API call)
    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );
    
    if (foundUser) {
      // Create user session object (without password)
      const { password: _, ...userSession } = foundUser;
      
      // Store in local storage
      localStorage.setItem("upastithi_user", JSON.stringify(userSession));
      
      // Update state
      setUser(userSession);
      toast.success("Successfully logged in");
    } else {
      toast.error("Invalid email or password");
    }
    
    setLoading(false);
  };

  // Signup function
  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email is already in use
    if (MOCK_USERS.some(u => u.email === email)) {
      toast.error("Email already in use");
      setLoading(false);
      return;
    }
    
    // Create new user
    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      name,
      email,
      password,
      role,
    };
    
    // In a real app, this would be an API call to create the user
    // For now, we just simulate success
    
    // Create user session object (without password)
    const { password: _, ...userSession } = newUser;
    
    // Store in local storage
    localStorage.setItem("upastithi_user", JSON.stringify(userSession));
    
    // Update state
    setUser(userSession);
    toast.success("Account created successfully");
    
    setLoading(false);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("upastithi_user");
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
