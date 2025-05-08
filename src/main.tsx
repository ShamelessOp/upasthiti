
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { supabase } from './integrations/supabase/client';

// Initialize the app
const initApp = async () => {
  try {
    console.log("Initializing app...");
    
    // Get the Supabase session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error checking Supabase session:", error);
    }
    
    if (data.session) {
      console.log("User is already logged in:", data.session.user.email);
    } else {
      console.log("No active session found");
    }
    
    // Render the app
    createRoot(document.getElementById("root")!).render(<App />);
  } catch (error) {
    console.error("Application initialization failed:", error);
    // Fallback to ensure the app renders even if data loading fails
    createRoot(document.getElementById("root")!).render(<App />);
  }
};

// Start the application
initApp();
