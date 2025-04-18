
import React, { ReactNode, useEffect } from 'react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function AppLayout({ children, requireAuth = true }: AppLayoutProps) {
  const { isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    // Verify auth on component mount
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("AppLayout auth check:", {
        hasSession: !!data.session,
        contextAuth: isAuthenticated,
        user: user?.email
      });
      
      if (requireAuth && !data.session && !isAuthenticated) {
        toast.error("Session expired. Please login again.");
      }
    };
    
    checkAuth();
  }, [isAuthenticated, requireAuth, user]);

  console.log("AppLayout render:", { isAuthenticated, loading, requireAuth });

  if (requireAuth && !loading && !isAuthenticated) {
    console.log("Redirecting to login - not authenticated");
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {isAuthenticated && <AppSidebar />}
        <main className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 flex h-14 items-center border-b border-border bg-background px-4">
            <SidebarTrigger className="mr-4">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Sidebar</span>
            </SidebarTrigger>
            <h1 className="text-lg font-semibold">Upastithi</h1>
          </div>
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
