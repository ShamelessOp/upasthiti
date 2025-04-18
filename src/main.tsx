
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { supabase } from './integrations/supabase/client';

// Initialize Supabase auth
console.log("Initializing Supabase auth...");

// Check for stored tokens and log detailed info
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");
console.log("Stored auth state:", { 
  hasStoredUser: !!storedUser, 
  storedUserEmail: storedUser ? JSON.parse(storedUser).email : null,
  hasToken: !!storedToken 
});

// Pre-initialize the app
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

// Render loading state first for better UX
root.render(
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    <span className="ml-3">Loading application...</span>
  </div>
);

// Verify that Supabase client is properly initialized
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error("Failed to initialize Supabase auth:", error);
  }
  
  console.log("Supabase auth initialized", data.session ? "with session" : "without session");
  
  if (data.session) {
    console.log("User is authenticated:", data.session.user.email);
    // Make sure local storage is in sync with session
    localStorage.setItem("user", JSON.stringify(data.session.user));
    localStorage.setItem("token", data.session.access_token);
  } else {
    console.log("No user session found. User needs to log in.");
    // Clear any potentially stale data
    if (storedUser || storedToken) {
      console.log("Clearing stale authentication data");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }
  
  // Render the app after checking the session
  root.render(<App />);
});

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth state changed:", event, session ? "User: " + session.user.email : "No user");
  
  // Handle session changes
  if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    if (session) {
      localStorage.setItem("user", JSON.stringify(session.user));
      localStorage.setItem("token", session.access_token);
    }
  } else if (event === 'SIGNED_OUT') {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
});
