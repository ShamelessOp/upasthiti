
// User data models

export type UserRole = "admin" | "supervisor" | "siteManager";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  siteId?: string;
  createdAt: string;
  lastLogin: string | null;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration extends UserCredentials {
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}
