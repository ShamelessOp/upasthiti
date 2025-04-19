
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { authService } from './services/authService.ts'

// Initialize the app
const initApp = async () => {
  try {
    // Auto-login for demo purposes
    await authService.autoLogin();
    
    // Render the app
    createRoot(document.getElementById("root")!).render(<App />);
  } catch (error) {
    console.error("Application initialization failed:", error);
  }
};

// Start the application
initApp();
