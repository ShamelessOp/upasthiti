
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useAppInitialization } from "@/hooks/useAppInitialization";

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
import IoTControls from "@/pages/IoTControls/IoTControls";

// Not Found Page
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // You can log auth status for debugging
    console.log("Auth status:", { isAuthenticated, loading });
  }, [isAuthenticated, loading]);
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  // Initialize app and real-time functionality
  useAppInitialization();
  
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<Navigate to="/sites" replace />} />
      
      <Route 
        path="/sites" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Sites />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/sites/:siteId/*" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/users" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Users />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/attendance" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Attendance />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/payroll" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Payroll />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/inventory" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Inventory />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/cashbook" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Cashbook />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/reports" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <Reports />
            </AppLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/iot-controls" 
        element={
          <ProtectedRoute>
            <AppLayout>
              <IoTControls />
            </AppLayout>
          </ProtectedRoute>
        } 
      />

      {/* Redirect to home if no match */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
