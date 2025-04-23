
import React, { ReactNode, useEffect } from 'react';
import { AppSidebar } from './AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { WelcomeTour } from './WelcomeTour';
import { localStorageService } from '@/services/localStorage';
import { Site } from '@/models/site';

interface AppLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function AppLayout({ children, requireAuth = true }: AppLayoutProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const isNewUser = user && !localStorageService.get<boolean>(`tour_shown_${user.id}`);
  
  useEffect(() => {
    // Check if we need to handle a new real user (not the demo admin)
    if (user && user.email !== "admin@upastithi.com") {
      const userDataInitialized = localStorageService.get<boolean>(`data_initialized_${user.id}`);
      
      if (!userDataInitialized) {
        console.log("New user detected, ensuring clean environment for:", user.email);
        
        // Don't clear all data, as that would affect the demo admin
        // Instead, we'll use user-specific logic in the services to filter data
        
        // Mark this user as initialized so we don't repeat the cleanup
        localStorageService.set(`data_initialized_${user.id}`, true);
        
        // Show Welcome tour for new users
        localStorageService.set(`tour_shown_${user.id}`, false);
      }
    }
  }, [user]);

  if (requireAuth && !loading && !isAuthenticated) {
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
        {isNewUser && <WelcomeTour />}
      </div>
    </SidebarProvider>
  );
}
