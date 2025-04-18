
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { supabase } from './integrations/supabase/client';

// Initialize Supabase auth
console.log("Initializing Supabase auth...");

// Verify that Supabase client is properly initialized
supabase.auth.getSession().then(({ data }) => {
  console.log("Supabase auth initialized", data.session ? "with session" : "without session");
  
  if (data.session) {
    console.log("User is authenticated:", data.session.user.email);
  } else {
    console.log("No user session found. User needs to log in.");
  }
  
  // Render the app after checking the session
  createRoot(document.getElementById("root")!).render(<App />);
});

// Set up auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log("Auth state changed:", event, session ? "User: " + session.user.email : "No user");
});
