
import { User, UserCredentials, UserRegistration, UserRole } from "@/models/user";
import { apiRequest } from "./api";
import { localStorageService } from "./localStorage";
import { toast } from "sonner";

// In-memory mock user database
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

  // Login user
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
      
      toast.success("Successfully logged in");
      return userSession;
    }, "Login failed").then(response => response.data);
  },

  // Register new user
  async register(userData: UserRegistration): Promise<User | null> {
    return apiRequest<User>(async () => {
      // Check if email is already in use
      if (MOCK_USERS.some(u => u.email === userData.email)) {
        throw new Error("Email already in use");
      }
      
      // Create new user
      const nowIso = new Date().toISOString();
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
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
    toast.success("Successfully logged out");
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

  // Auto-login for development/demo purposes (new function)
  async autoLogin(): Promise<User | null> {
    // Check if already logged in
    if (this.isAuthenticated()) {
      return this.getCurrentUser();
    }
    
    // Use admin credentials by default
    return this.login({ 
      email: "admin@upastithi.com", 
      password: "password123" 
    });
  },
  
  // Set session timeout (24 hours by default)
  setSessionTimeout(hours = 24): void {
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + hours);
    localStorageService.set("sessionExpires", expiration.toISOString());
  }
};
