
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { authService } from './services/authService.ts'
import { siteService } from './services/siteService.ts'
import { workerService } from './services/workerService.ts'
import { attendanceService } from './services/attendanceService.ts'
import { localStorageService } from './services/localStorage.ts'
import { Site } from '@/models/site.ts'

// Initialize the app with sample data
const initApp = async () => {
  try {
    console.log("Initializing app with sample data...");
    
    // Auto-login for demo purposes
    await authService.autoLogin();
    
    // Check if we already have sample data
    const existingSites = localStorageService.get<Site[]>('sites');
    
    // Only add sample data if none exists
    if (!existingSites || existingSites.length === 0) {
      console.log("No existing data found. Adding sample data...");
      
      // Add sample sites
      const sites = await siteService.addSampleSites();
      console.log("Added sample sites:", sites);
      
      // For each site, add workers
      for (const site of sites) {
        const workers = await workerService.addSampleWorkers(site.id);
        console.log(`Added ${workers.length} sample workers for site ${site.name}`);
        
        // Generate 3 days of attendance records for all workers
        const today = new Date();
        for (let i = 0; i < 3; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateString = date.toISOString().split('T')[0];
          
          for (const worker of workers) {
            // Create attendance record with random status
            const status = Math.random() > 0.1 ? "Present" : "Absent";
            const checkInTime = status === "Present" ? 
              `0${Math.floor(Math.random() * 2) + 8}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : 
              "";
            const checkOutTime = status === "Present" ? 
              `${Math.floor(Math.random() * 2) + 17}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : 
              "";
            
            await attendanceService.markAttendance({
              workerId: worker.id,
              workerName: worker.name,
              siteId: site.id,
              siteName: site.name,
              date: dateString,
              checkInTime: checkInTime,
              checkOutTime: checkOutTime,
              status: status,
              overtimeHours: status === "Present" ? Math.floor(Math.random() * 3) : 0
            });
          }
          console.log(`Generated attendance for ${dateString}`);
        }
      }
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
