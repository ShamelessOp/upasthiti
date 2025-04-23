
import { User, UserCredentials, UserRegistration, UserRole } from "@/models/user";
import { apiRequest } from "./api";
import { localStorageService } from "./localStorage";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Mock users (only used if Supabase auth fails)
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@upastithi.com",
    password: "password123",
    role: "admin" as UserRole,
    createdAt: "2025-01-01T00:00:00Z",
    created_at: "2025-01-01T00:00:00Z",
    lastLogin: null,
  },
  {
    id: "2",
    name: "Site Manager",
    email: "manager@upastithi.com",
    password: "password123",
    role: "siteManager" as UserRole,
    siteId: "1",
    createdAt: "2025-01-15T00:00:00Z",
    created_at: "2025-01-15T00:00:00Z",
    lastLogin: null,
  },
  {
    id: "3",
    name: "Site Supervisor",
    email: "supervisor@upastithi.com",
    password: "password123",
    role: "supervisor" as UserRole,
    siteId: "2",
    createdAt: "2025-02-01T00:00:00Z",
    created_at: "2025-02-01T00:00:00Z",
    lastLogin: null,
  },
];

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
    return localStorageService.get<User>(USER_STORAGE_KEY);
  },

  // Login user (fallback for mock auth)
  async login(credentials: UserCredentials): Promise<User | null> {
    return apiRequest<User>(async () => {
      // Find user by email and password
      const user = MOCK_USERS.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      
      if (!user) {
        throw new Error("Invalid email or password");
      }
      
      // Update last login time
      const nowIso = new Date().toISOString();
      
      // Create user session object (without password)
      const { password: _, ...userSession } = {
        ...user,
        lastLogin: nowIso
      };
      
      // Store in local storage
      localStorageService.set(USER_STORAGE_KEY, userSession);
      localStorageService.set(TOKEN_STORAGE_KEY, `mock-token-${userSession.id}`);
      
      // Set a default session timeout for 24 hours
      this.setSessionTimeout();
      
      // Check if this user has initialized data before
      const hasInitialized = localStorageService.get<boolean>(`data_initialized_${userSession.id}`);
      
      // If this is a first-time login for this user, prepare their environment
      if (!hasInitialized) {
        console.log("First login for user:", userSession.id);
        // This flag will be used to show the welcome tour
        // The actual data initialization happens in AppLayout
      }
      
      toast.success("Successfully logged in");
      return userSession;
    }, "Login failed").then(response => response.data);
  },

  // Register new user (fallback for mock auth)
  async register(userData: UserRegistration): Promise<User | null> {
    return apiRequest<User>(async () => {
      // Check if email is already in use
      if (MOCK_USERS.some(u => u.email === userData.email)) {
        throw new Error("Email already in use");
      }
      
      // Create new user
      const nowIso = new Date().toISOString();
      const userId = `user-${Date.now()}`;
      const newUser = {
        id: userId,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        createdAt: nowIso,
        created_at: nowIso,
        lastLogin: nowIso,
      };
      
      // Add to mock database (in a real app, this would be an API call)
      MOCK_USERS.push(newUser);
      
      // Create user session object (without password)
      const { password: _, ...userSession } = newUser;
      
      // Store in local storage
      localStorageService.set(USER_STORAGE_KEY, userSession);
      localStorageService.set(TOKEN_STORAGE_KEY, `mock-token-${userSession.id}`);
      
      // Set a default session timeout
      this.setSessionTimeout();
      
      toast.success("Account created successfully");
      return userSession;
    }, "Registration failed").then(response => response.data);
  },

  // Logout user
  logout(): void {
    localStorageService.remove(USER_STORAGE_KEY);
    localStorageService.remove(TOKEN_STORAGE_KEY);
  },

  // Auto-login for development/demo purposes
  async autoLogin(): Promise<any> {
    try {
      console.log("Checking for existing session...");
      
      // First check Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        console.log("Found existing Supabase session");
        const currentUser = {
          id: session.user.id,
          name: session.user.user_metadata?.name || "User",
          email: session.user.email || "",
          role: (session.user.user_metadata?.role as UserRole) || "siteManager",
          createdAt: session.user.created_at,
          lastLogin: new Date().toISOString()
        };
        
        // Store locally for compatibility with existing code
        localStorageService.set(USER_STORAGE_KEY, currentUser);
        return currentUser;
      }
      
      // If no session, use demo admin for development
      console.log("No session found, using demo admin user...");
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        console.log("User already logged in:", currentUser);
        return currentUser;
      }
      
      // Create a demo admin user only for admin@upastithi.com
      const adminUser = {
        id: "admin-123",
        email: "admin@upastithi.com",
        name: "Demo Admin",
        role: "admin" as UserRole,
        createdAt: new Date().toISOString(),
      };
      
      // Store in localStorage
      localStorageService.set(USER_STORAGE_KEY, adminUser);
      localStorageService.set('upastithi_authenticated', 'true');
      
      console.log("Auto-logged in as:", adminUser);
      return adminUser;
    } catch (error) {
      console.error("Auto-login failed:", error);
      throw error;
    }
  },
  
  // Set session timeout (24 hours by default)
  setSessionTimeout(hours = 24): void {
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + hours);
    localStorageService.set("sessionExpires", expiration.toISOString());
  },
  
  // Check if user is admin
  isAdmin(user: User | null): boolean {
    if (!user) return false;
    return user.role === 'admin' || user.email === 'admin@upastithi.com';
  }
};
