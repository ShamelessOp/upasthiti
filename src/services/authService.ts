
import { User, UserCredentials, UserRegistration, UserRole } from "@/models/user";
import { apiRequest } from "./api";
import { localStorageService } from "./localStorage";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// In-memory mock user database for development/demo purposes
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
  
  // Update local user (for compatibility)
  updateLocalUser(user: User): void {
    localStorageService.set(USER_STORAGE_KEY, user);
    localStorageService.set(TOKEN_STORAGE_KEY, `mock-token-${user.id}`);
    this.setSessionTimeout();
  },
  
  // Clear local user
  clearLocalUser(): void {
    localStorageService.remove(USER_STORAGE_KEY);
    localStorageService.remove(TOKEN_STORAGE_KEY);
  },

  // Login user (fallback for demo)
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
      
      console.log("Logged in mock user:", userSession);
      
      return userSession;
    }, "Login failed").then(response => response.data);
  },

  // Register new user (fallback for demo)
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
      
      return userSession;
    }, "Registration failed").then(response => response.data);
  },

  // Logout user
  logout(): void {
    localStorageService.remove(USER_STORAGE_KEY);
    localStorageService.remove(TOKEN_STORAGE_KEY);
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
    return localStorageService.get<string>(TOKEN_STORAGE_KEY);
  },

  // Auto-login for development/demo purposes
  async autoLogin(): Promise<any> {
    try {
      console.log("Auto-logging in as admin...");
      
      // Check if already logged in via Supabase
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        console.log("User already logged in via Supabase:", data.session.user);
        return {
          id: data.session.user.id,
          name: data.session.user.user_metadata.name || data.session.user.email?.split('@')[0] || 'Demo User',
          email: data.session.user.email,
          role: data.session.user.user_metadata.role || 'admin',
          createdAt: data.session.user.created_at,
          lastLogin: new Date().toISOString()
        };
      }
      
      // Check if already logged in via local storage
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        console.log("User already logged in via local storage:", currentUser);
        return currentUser;
      }
      
      // Try to sign in with Supabase
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: "admin@upastithi.com",
          password: "password123"
        });
        
        if (!error && data.user) {
          console.log("Auto-logged in via Supabase:", data.user);
          const user = {
            id: data.user.id,
            name: data.user.user_metadata.name || 'Demo Admin',
            email: data.user.email || 'admin@upastithi.com',
            role: data.user.user_metadata.role || 'admin',
            createdAt: data.user.created_at,
            lastLogin: new Date().toISOString()
          };
          
          this.updateLocalUser(user);
          return user;
        }
      } catch (supabaseError) {
        console.error("Supabase auto-login failed:", supabaseError);
      }
      
      // Fall back to mock user
      const adminUser = {
        id: "admin-123",
        email: "admin@upastithi.com",
        name: "Demo Admin",
        role: "admin",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      // Store in localStorage
      this.updateLocalUser(adminUser);
      
      console.log("Auto-logged in as mock user:", adminUser);
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
  }
};
