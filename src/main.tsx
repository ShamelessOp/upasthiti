
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { supabase } from './integrations/supabase/client';

// Initialize Supabase auth
// Log Supabase initialization
console.log("Initializing Supabase auth...");

// Verify that Supabase client is properly initialized
supabase.auth.getSession().then(({ data }) => {
  console.log("Supabase auth initialized", data.session ? "with session" : "without session");
});

createRoot(document.getElementById("root")!).render(<App />);
