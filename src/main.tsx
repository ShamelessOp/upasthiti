
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize the app with Supabase
const initApp = async () => {
  try {
    console.log("Initializing app with Supabase backend...");
    
    // Render the app - Supabase session will be handled by AuthContext
    createRoot(document.getElementById("root")!).render(<App />);
  } catch (error) {
    console.error("Application initialization failed:", error);
    // Ensure the app renders even if initialization fails
    createRoot(document.getElementById("root")!).render(<App />);
  }
};

// Start the application
initApp();
