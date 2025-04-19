
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize the app
const initApp = async () => {
  try {
    createRoot(document.getElementById("root")!).render(<App />);
  } catch (error) {
    console.error("Application initialization failed:", error);
  }
};

// Start the application
initApp();
