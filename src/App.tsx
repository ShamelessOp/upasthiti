
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";

// Auth Pages
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";

// Main Pages
import Sites from "@/pages/Sites/Sites";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Users from "@/pages/Users/Users";
import Attendance from "@/pages/Attendance/Attendance";
import Payroll from "@/pages/Payroll/Payroll";
import Inventory from "@/pages/Inventory/Inventory";
import Cashbook from "@/pages/Cashbook/Cashbook";
import Settings from "@/pages/Settings/Settings";
import Reports from "@/pages/Reports/Reports";

// Not Found Page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<AppLayout><Sites /></AppLayout>} />
            <Route path="/sites/:siteId" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/sites/:siteId/users" element={<AppLayout><Users /></AppLayout>} />
            <Route path="/sites/:siteId/attendance" element={<AppLayout><Attendance /></AppLayout>} />
            <Route path="/sites/:siteId/payroll" element={<AppLayout><Payroll /></AppLayout>} />
            <Route path="/sites/:siteId/inventory" element={<AppLayout><Inventory /></AppLayout>} />
            <Route path="/sites/:siteId/cashbook" element={<AppLayout><Cashbook /></AppLayout>} />
            <Route path="/sites/:siteId/settings" element={<AppLayout><Settings /></AppLayout>} />
            <Route path="/sites/:siteId/reports" element={<AppLayout><Reports /></AppLayout>} />

            {/* Redirect to home if no match */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
